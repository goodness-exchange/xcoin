'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('No token found. Please log in.');
      return;
    }
    axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || 'Error fetching user data');
      });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {message && <p>{message}</p>}
      {user && (
        <div>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
