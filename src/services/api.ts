// src/services/api.ts
const API_BASE_URL = 'http://localhost:3001/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to make API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  
  return response.json();
};

// Auth APIs
export const authAPI = {
  login: async (bknetId: string, password: string) => {
    const response = await apiCall('/login', {
      method: 'POST',
      body: JSON.stringify({ bknetId, password }),
    });
    
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },
  
  register: async (data: {
    bknetId: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
    email?: string;
  }) => {
    const response = await apiCall('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Questions APIs
export const questionsAPI = {
  getAll: async (filters?: { topic?: string; status?: string; tags?: string[] }) => {
    const params = new URLSearchParams();
    if (filters?.topic) params.append('topic', filters.topic);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.tags) filters.tags.forEach(tag => params.append('tags', tag));
    
    const queryString = params.toString();
    return apiCall(`/questions${queryString ? '?' + queryString : ''}`);
  },
  
  getById: async (id: string) => {
    return apiCall(`/questions/${id}`);
  },
  
  create: async (data: {
    title: string;
    content: string;
    topic: string;
    tags?: string[];
    userId: string;
  }) => {
    return apiCall('/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  addAnswer: async (questionId: string, data: { content: string; userId: string }) => {
    return apiCall(`/questions/${questionId}/answer`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Contests APIs
export const contestsAPI = {
  getAll: async () => {
    return apiCall('/contests');
  },
  
  getById: async (id: string) => {
    return apiCall(`/contests/${id}`);
  },
  
  create: async (data: {
    title: string;
    type: 'academic' | 'non-academic';
    description: string;
    startDate: string;
    endDate: string;
    maxParticipants?: number;
    prize?: string;
    rules?: string;
    userId: string;
  }) => {
    return apiCall('/contests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  register: async (contestId: string, userId: string) => {
    return apiCall(`/contests/${contestId}/register`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },
  
  addQuestions: async (contestId: string, questions: any[]) => {
    return apiCall(`/contests/${contestId}/questions`, {
      method: 'POST',
      body: JSON.stringify({ questions }),
    });
  },
  
  submitAnswers: async (contestId: string, userId: string, answers: any[]) => {
    return apiCall(`/contests/${contestId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ userId, answers }),
    });
  },
  
  getResults: async (contestId: string) => {
    return apiCall(`/contests/${contestId}/results`);
  },
  
  getUserResult: async (contestId: string, userId: string) => {
    return apiCall(`/contests/${contestId}/my-result?userId=${userId}`);
  },
};

// Sessions APIs
export const sessionsAPI = {
  getAll: async (type?: 'my' | 'upcoming' | 'ongoing', userId?: string) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (userId) params.append('userId', userId);
    
    const queryString = params.toString();
    return apiCall(`/sessions${queryString ? '?' + queryString : ''}`);
  },
  
  getById: async (id: string) => {
    return apiCall(`/sessions/${id}`);
  },
  
  join: async (sessionId: string, userId: string) => {
    return apiCall(`/sessions/${sessionId}/join`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },
};

// Tutors APIs
export const tutorsAPI = {
  getAll: async () => {
    return apiCall('/tutors');
  },
  
  getById: async (id: string) => {
    return apiCall(`/tutors/${id}`);
  },
  
  getSuggestions: async (userId?: string) => {
    const params = userId ? `?userId=${userId}` : '';
    return apiCall(`/tutors/suggestions${params}`);
  },
  
  getDepartments: async () => {
    return apiCall('/tutors/departments');
  },
  
  getSpecializations: async () => {
    return apiCall('/tutors/specializations');
  },
};

export const reportsAPI = {
  getStudentActivity: async (semester?: string, department?: string) => {
    const params = new URLSearchParams();
    if (semester) params.append('semester', semester);
    if (department) params.append('department', department);
    const queryString = params.toString();
    return apiCall(`/reports/student-activity${queryString ? '?' + queryString : ''}`);
  },
  
  getCourseStatistics: async () => {
    return apiCall('/reports/course-statistics');
  },
};

export default {
  auth: authAPI,
  questions: questionsAPI,
  contests: contestsAPI,
  sessions: sessionsAPI,
  tutors: tutorsAPI,
  reports: reportsAPI,
};
