import React from 'react';
import { Camera } from 'lucide-react';

function StudentDetail({ student, onDeleteClick }) {
  return (
    <>
      <div className="student-detail">
        <div className="student-avatar">
          <Camera size={64} />
        </div>
        <div className="student-info">
          <h3>{student.name}</h3>
          <p className="student-id"><span className='detail'>ID:</span> {student.id}</p>
          <p className="student-email"><span className='detail'>Email:</span> {student.email}</p>
          <p className="student-course"><span className='detail'>Course:</span> {student.course}</p>
          <p className="student-grade"><span className='detail'>Grade:</span> {student.grade}</p>
          <p className="student-attendance"><span className='detail'>Attendance:</span> {student.attendance}</p>
        </div>
      </div>
      <div className='button-container'>
        <button className='delete-button' onClick={() => onDeleteClick(student.id)}>Delete</button>
      </div>
    </>
  );
}

export default StudentDetail;