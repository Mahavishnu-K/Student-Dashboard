import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './analytics.css';

export default function StudentAnalytics({ students }) {
  const containerRef = useRef(null);
  const [gradeData, setGradeData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [activeTab, setActiveTab] = useState('grades');

  useEffect(() => {
    if (students && students.length > 0) {
      // Process grade data
      const grades = {};
      students.forEach(student => {
        const grade = student.grade;
        if (grades[grade]) {
          grades[grade] += 1;
        } else {
          grades[grade] = 1;
        }
      });
      
      const gradeDataArray = Object.keys(grades).map(grade => ({
        name: grade,
        count: grades[grade],
      }));
      
      // Sort grades in logical order
      const gradeOrder = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
      gradeDataArray.sort((a, b) => gradeOrder.indexOf(a.name) - gradeOrder.indexOf(b.name));
      
      setGradeData(gradeDataArray);
      
      // Process attendance data
      const attendanceRanges = {
        '90-100%': 0,
        '80-89%': 0,
        '70-79%': 0,
        '<70%': 0,
      };
      
      students.forEach(student => {
        const attendance = parseInt(student.attendance);
        if (attendance >= 90) {
          attendanceRanges['90-100%'] += 1;
        } else if (attendance >= 80) {
          attendanceRanges['80-89%'] += 1;
        } else if (attendance >= 70) {
          attendanceRanges['70-79%'] += 1;
        } else {
          attendanceRanges['<70%'] += 1;
        }
      });
      
      const attendanceDataArray = Object.keys(attendanceRanges).map(range => ({
        name: range,
        value: attendanceRanges[range],
      }));
      
      setAttendanceData(attendanceDataArray);
      
      // Process course data
      const courses = {};
      students.forEach(student => {
        const course = student.course;
        if (courses[course]) {
          courses[course] += 1;
        } else {
          courses[course] = 1;
        }
      });
      
      const courseDataArray = Object.keys(courses).map(course => ({
        name: course,
        count: courses[course],
      }));
      
      setCourseData(courseDataArray);
    }
  }, [students]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
  
  // Function to automatically scroll to selected tab on mobile
  const scrollToActiveTab = (tabName) => {
    setActiveTab(tabName);
    
    // Give time for the DOM to update
    setTimeout(() => {
      const activeTabElement = document.querySelector('.analytics-tab.active');
      if (activeTabElement && containerRef.current) {
        const container = containerRef.current.querySelector('.analytics-tabs');
        if (container) {
          const scrollPosition = activeTabElement.offsetLeft - container.offsetWidth / 2 + activeTabElement.offsetWidth / 2;
          container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        }
      }
    }, 50);
  };

  // Function to get chart height based on screen size
  const getChartHeight = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640 ? 250 : 300;
    }
    return 300;
  };

  return (
    <div className="analytics-container" ref={containerRef}>
      <div className="analytics-tabs">
        <button
          className={`analytics-tab ${activeTab === 'grades' ? 'active' : ''}`}
          onClick={() => scrollToActiveTab('grades')}
        >
          Grade Distribution
        </button>
        <button
          className={`analytics-tab ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => scrollToActiveTab('attendance')}
        >
          Attendance Overview
        </button>
        <button
          className={`analytics-tab ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => scrollToActiveTab('courses')}
        >
          Course Distribution
        </button>
      </div>
      
      <div className="analytics-content">
        {activeTab === 'grades' && (
          <div className="chart-container">
            <h3 className="chart-title">Student Grade Distribution</h3>
            <ResponsiveContainer width="100%" height={getChartHeight()}>
              <BarChart
                data={gradeData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="count" name="Number of Students" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {activeTab === 'attendance' && (
          <div className="chart-container">
            <h3 className="chart-title">Student Attendance Overview</h3>
            <ResponsiveContainer width="100%" height={getChartHeight()}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={window.innerWidth > 480}
                  label={window.innerWidth > 480 ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : null}
                  outerRadius={window.innerWidth < 480 ? 80 : 100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} students`, 'Count']} />
                <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {activeTab === 'courses' && (
          <div className="chart-container">
            <h3 className="chart-title">Students by Course</h3>
            <ResponsiveContainer width="100%" height={getChartHeight() + 30}>
              <BarChart
                data={courseData}
                margin={{
                  top: 10,
                  right: 10,
                  left: window.innerWidth < 480 ? 100 : 150,
                  bottom: 20,
                }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={window.innerWidth < 480 ? 90 : 140}
                  fontSize={12}
                  tick={{ fontSize: window.innerWidth < 480 ? 10 : 12 }}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="count" name="Number of Students" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}