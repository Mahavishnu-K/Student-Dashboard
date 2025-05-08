import { useState, useEffect } from 'react';
import { LogIn, LogOut, Plus, Search, X, BarChart2 } from 'lucide-react';
import StudentTable from '../components/table';
import LoginForm from '../components/login';
import StudentForm from '../components/studentForm';
import StudentDetail from '../components/details';
import StudentAnalytics from '../components/analytics/analytics';
import { fetchStudents, createStudent, deleteStudent } from '../api/mockApi';
import { auth, loginWithEmailAndPassword, logoutUser } from '../auth/firebaseAuth';
import { onAuthStateChanged } from 'firebase/auth';

export default function StudentDashboard() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [addStudentClicked, setAddStudentClicked] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [error, setError] = useState('');
  const [loginMessage, setLoginMessage] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [loginButtonClicked, setLoginButtonClicked] = useState(false);
  
  const courses = [...new Set(students.map(student => student.course))];
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const data = await fetchStudents();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        setError('Failed to fetch students');
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStudents();
  }, []);
  
  useEffect(() => {
    let result = students;
    
    if (selectedCourse) {
      result = result.filter(student => student.course === selectedCourse);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(student => 
        student.name.toLowerCase().includes(term) || 
        student.email.toLowerCase().includes(term)
      );
    }
    
    setFilteredStudents(result);
  }, [selectedCourse, searchTerm, students]);
  
  const handleAddStudent = () => {
    if (!isAuthenticated) {
      setAddStudentClicked(true);
      setIsLoginModalOpen(true);
      return;
    }
    
    setIsAddStudentModalOpen(true);
  };
  
  const handleStudentClick = (student) => {
    if (!isAuthenticated) {
      setSelectedStudent(student);
      setAddStudentClicked(false);
      setIsLoginModalOpen(true);
    } else {
      setSelectedStudent(student);
      setIsDetailModalOpen(true);
    }
  };
  
  const handleLogin = async (email, password) => {
    try {
      setAuthError('');
      await loginWithEmailAndPassword(email, password);
      setLoginMessage(true);
      setLoginButtonClicked(false);
      setIsLoginModalOpen(false);
      
      if (selectedStudent) {
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      setAuthError('Invalid email or password');
      console.error('Login error:', error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      setLoginMessage(false);
      setIsDetailModalOpen(false);
      setIsAddStudentModalOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const handleSubmitNewStudent = async (formData) => {
    try {
      const newStudent = await createStudent(formData);
      setStudents([...students, newStudent]);
      setIsAddStudentModalOpen(false);
    } catch (error) {
      setError('Failed to add student');
      console.error('Error adding student:', error);
    }
  };

  const handleStudentDelete = async (id) => {
    try{
      await deleteStudent(id);
      const updatedStudents = students.filter(student => student.id !== id);
      setStudents(updatedStudents);
      setIsDetailModalOpen(false);
    }catch(error) {
      setError('Failed to delete student');
      console.error('Error deleting student', error);
    }
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  // Format attendance percentage for analytics
  const studentsWithFormattedAttendance = students.map(student => ({
    ...student,
    attendance: parseInt(student.attendance.replace('%', ''))
  }));

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-container">
          <h1 className="header-title">
            Student Management Dashboard
          </h1>
          <div>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="logout-button"
              >
                <LogOut className="button-icon" /> Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setLoginButtonClicked(true);
                  setIsLoginModalOpen(true); 
                  setAddStudentClicked(false);
                  setSelectedStudent(null);
                }}
                className="login-button"
              >
                <LogIn className="button-icon" /> Login
              </button>
            )}
          </div>
        </div>
      </header>

      {isAuthenticated && (
        <div className="login-message">
          <p className='welcome-text'>Welcome <span style={{ color: "#3b82f6" }}>Admin</span></p>
          <p>You can update, view, and analyze student details</p>
        </div>
      )}


      <main className="main-content">
        {isAuthenticated && (
          <div className="analytics-section">
            <div className="analytics-header">
              <h2>Student Analytics</h2>
              <button className="analytics-toggle" onClick={toggleAnalytics}>
                <BarChart2 className="button-icon" /> {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
              </button>
            </div>
            
            {showAnalytics && !loading && (
              <StudentAnalytics students={studentsWithFormattedAttendance} />
            )}
          </div>
        )}

        <div className="controls-section">
          <div className="search-filter-group">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <Search className="search-icon" />
            </div>
            
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="course-select"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleAddStudent}
            className="add-student-button"
          >
            <Plus className="button-icon" /> Add Student
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading students...</p>
          </div>
        ) : (
          <>
            {filteredStudents.length === 0 ? (
              <div className="empty-state">
                <p>No students found. Try changing your filters.</p>
              </div>
            ) : (
              <StudentTable 
                students={filteredStudents} 
                onStudentClick={handleStudentClick} 
              />
            )}
          </>
        )}
      </main>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              {loginButtonClicked ? (
                <h2>Login</h2>
              ) : (
                <h2>Login Required</h2>
              )}
              
              <button className="close-button" onClick={() => {
                setIsLoginModalOpen(false);
                setLoginButtonClicked(false);
              }}>
                <X />
              </button>
            </div>
            <div className="modal-body">
              {loginButtonClicked ? null:
                (addStudentClicked ? (
                  <p>Please login to add a new student.</p>
                ) : (
                  <p>Please login to view student details.</p>
                )
              )}
              {authError && <div className="auth-error">{authError}</div>}
              <LoginForm onLogin={handleLogin} />
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddStudentModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Student</h2>
              <button className="close-button" onClick={() => setIsAddStudentModalOpen(false)}>
                <X />
              </button>
            </div>
            <div className="modal-body">
              <StudentForm onSubmit={handleSubmitNewStudent} />
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {isDetailModalOpen && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Student Details</h2>
              <button className="close-button" onClick={() => setIsDetailModalOpen(false)}>
                <X />
              </button>
            </div>
            <div className="modal-body">
              <StudentDetail student={selectedStudent} onDeleteClick={handleStudentDelete}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}