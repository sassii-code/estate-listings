import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Newsletter
export const newsAPI = {
  subscribe: (email: string) =>
    apiClient.post('/news/newsdata', { email }),
};

// Properties (CRUD — admin-managed listings)
export const propertiesAPI = {
  getAll: () =>
    apiClient.get('/products/list'),

  getById: (id: string) =>
    apiClient.get(`/products/single/${id}`),
};

// Public appointment booking
export const appointmentsAPI = {
  schedule: (data: {
    propertyId: string;
    date: string;
    time: string;
    name: string;
    email: string;
    phone: string;
    message?: string;
  }) =>
    apiClient.post('/appointments/schedule', data),

};

// Property enquiries
export const enquiriesAPI = {
  submit: (data: {
    type?: 'Buyer' | 'Owner';
    name: string;
    phone: string;
    email?: string;
    question?: string;
    propertyId?: string;
    propertyType?: string;
    locality?: string;
    purpose?: 'Sell' | 'Rent out';
    expectedPrice?: number;
    website?: string;
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
  }) => apiClient.post('/enquiries', data),
};

// Contact Form
export const contactAPI = {
  submit: (data: { name: string; email: string; phone: string; message: string }) =>
    apiClient.post('/forms/submit', data),
};

export default apiClient;
