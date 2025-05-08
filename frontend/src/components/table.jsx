import React from 'react';

function StudentTable({ students, onStudentClick }) {
  return (
    <div className="student-list">
      <div className="table-container">
        <table className="student-table">
          <thead>
            <tr>
              <th>Unique ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Grade</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="student-row"
                onClick={() => onStudentClick(student)}
              >
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
                <td>{student.grade}</td>
                <td>{student.attendance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentTable;