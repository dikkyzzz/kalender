import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllProgress = async () => {
  try {
    const response = await axios.get(`${API_URL}/progress/all`, {
      headers: getAuthHeader()
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching all progress:', error);
    throw error;
  }
};

export const getProgressByMonth = async (month, year) => {
  try {
    const response = await axios.get(`${API_URL}/progress?month=${month}&year=${year}`, {
      headers: getAuthHeader()
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching progress:', error);
    throw error;
  }
};

export const getProgressByDate = async (date) => {
  try {
    const response = await axios.get(`${API_URL}/progress/date/${date}`, {
      headers: getAuthHeader()
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching progress by date:', error);
    throw error;
  }
};

export const createProgress = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/progress`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeader()
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating progress:', error);
    throw error;
  }
};

export const updateProgress = async (id, formData) => {
  try {
    const response = await axios.put(`${API_URL}/progress/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeader()
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};

export const deleteProgress = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/progress/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting progress:', error);
    throw error;
  }
};
