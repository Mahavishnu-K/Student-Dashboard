import { useState } from 'react';

function StudentForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    grade: '',
    attendance: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.course.trim()) {
      errors.course = 'Course is required';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="student-form">
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={`form-input ${formErrors.name ? 'input-error' : ''}`}
          required
        />
        {formErrors.name && <p className="error-text">{formErrors.name}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`form-input ${formErrors.email ? 'input-error' : ''}`}
          required
        />
        {formErrors.email && <p className="error-text">{formErrors.email}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="course">Course *</label>
        <select
          id="course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          className={`form-input ${formErrors.course ? 'input-error' : ''}`}
          required
        >
          <option value="">Select a course</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Data Science">Data Science</option>
          <option value="Business Administration">Business Administration</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
          <option value="Civil Engineering">Civil Engineering</option>
          <option value="Statistics">Statistics</option>
          <option value="Electrical Engineering">Electrical Engineering</option>
          <option value="Computer Applications">Computer Applications</option>
          <option value="Biotechnology">Biotechnology</option>
        </select>
        {formErrors.course && <p className="error-text">{formErrors.course}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="grade">Grade</label>
        <select
          id="grade"
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="">Select a grade</option>
          <option value="A+">A+</option>
          <option value="A">A</option>
          <option value="B+">B+</option>
          <option value="B">B</option>
          <option value="C+">C+</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="F">F</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="attendance">Attendance</label>
        <input
          id="attendance"
          name="attendance"
          type="text"
          value={formData.attendance}
          onChange={handleChange}
          placeholder="e.g. 95%"
          className="form-input"
          required
        />
      </div>
      
      <button type="submit" className="submit-button">Add Student</button>
    </form>
  );
}

export default StudentForm;