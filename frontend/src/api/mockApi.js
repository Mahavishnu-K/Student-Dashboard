import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const api = axios.create({
  baseURL: '/api',
});

const mock = new MockAdapter(api, { delayResponse: 1500 });

const students = [
  { id: 1, name: 'Thilak', email: 'thilak@gmail.com', course: 'Computer Science', grade: 'A', attendance: '95%' },
  { id: 2, name: 'Sam', email: 'sam@gmail.com', course: 'Data Science', grade: 'B+', attendance: '88%' },
  { id: 3, name: 'Kumar', email: 'kumar@gmail.com', course: 'Computer Science', grade: 'C', attendance: '79%' },
  { id: 4, name: 'Chandru', email: 'chandru@gmail.com', course: 'Business Administration', grade: 'B', attendance: '85%' },
  { id: 5, name: 'Ram', email: 'ram@gmail.com', course: 'Data Science', grade: 'A+', attendance: '98%' },
  { id: 6, name: 'Sarah', email: 'sarah@gmail.com', course: 'Computer Science', grade: 'D', attendance: '82%' },
  { id: 7, name: 'Anjali', email: 'anjali@gmail.com', course: 'Mechanical Engineering', grade: 'A', attendance: '91%' },
  { id: 8, name: 'Ravi', email: 'ravi@gmail.com', course: 'Civil Engineering', grade: 'B+', attendance: '76%' },
  { id: 9, name: 'Pooja', email: 'pooja@gmail.com', course: 'Statistics', grade: 'C', attendance: '87%' },
  { id: 10, name: 'Amit', email: 'amit@gmail.com', course: 'Electrical Engineering', grade: 'B', attendance: '80%' },
  { id: 11, name: 'Divya', email: 'divya@gmail.com', course: 'Statistics', grade: 'A+', attendance: '99%' },
  { id: 12, name: 'Siddharth', email: 'sid@gmail.com', course: 'Computer Applications', grade: 'C', attendance: '84%' },
  { id: 13, name: 'Neha', email: 'neha@gmail.com', course: 'Mechanical Engineering', grade: 'B+', attendance: '93%' },
  { id: 14, name: 'Arjun', email: 'arjun@gmail.com', course: 'Biotechnology', grade: 'A', attendance: '77%' },
  { id: 15, name: 'Lakshmi', email: 'lakshmi@gmail.com', course: 'Statistics', grade: 'A', attendance: '89%' },
];


mock.onGet('/students').reply(200, students);

mock.onGet(/\/students\/\d+/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  const student = students.find((s) => s.id === id);
 
  if (student) {
    return [200, student];
  }
  return [404, { message: 'Student not found' }];
});

mock.onPost('/students').reply((config) => {
  const newStudent = JSON.parse(config.data);
  const id = students.length + 1;
 
  const createdStudent = {
    id,
    ...newStudent,
  };
 
  students.push(createdStudent);
 
  return [201, createdStudent];
});

mock.onPut(/\/students\/\d+/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  const updatedStudent = JSON.parse(config.data);
  const index = students.findIndex((s) => s.id === id);
 
  if (index !== -1) {
    students[index] = {
      ...students[index],
      ...updatedStudent,
    };
    return [200, students[index]];
  }
 
  return [404, { message: 'Student not found' }];
});

mock.onDelete(/\/students\/\d+/).reply((config) => {
  const id = parseInt(config.url.split('/').pop());
  const index = students.findIndex((s) => s.id === id);
 
  if (index !== -1) {
    const deletedStudent = students[index];
    students.splice(index, 1);
    return [200, deletedStudent];
  }
 
  return [404, { message: 'Student not found' }];
});

// API service functions
export const fetchStudents = async () => {
  try {
    const response = await api.get('/students');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchStudentById = async (id) => {
  try {
    const response = await api.get(`/students/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createStudent = async (student) => {
  try {
    const response = await api.post('/students', student);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateStudent = async (id, student) => {
  try {
    const response = await api.put(`/students/${id}`, student);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;