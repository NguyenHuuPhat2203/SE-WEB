# Hướng dẫn tích hợp Backend vào Frontend

## ✅ Đã hoàn thành

1. **API Service Layer** (`src/services/api.ts`)
   - Auth APIs (login, register, logout)
   - Questions APIs
   - Contests APIs
   - Sessions APIs
   - Tutors APIs

2. **Data Formatters** (`src/services/dataFormatters.ts`)
   - Format user, tutor, contest, session, question data từ backend

3. **Auth Screens**
   - LoginScreen: Đã kết nối với `/api/login`
   - RegisterScreen: Đã kết nối với `/api/register`

## 📝 Cần cập nhật

### 1. **Student Q&A Screen** (`src/components/student/QAScreen.tsx`)

Thêm vào đầu file:
```typescript
import { useEffect, useState } from 'react';
import { questionsAPI, authAPI } from '../../services/api';
import { formatQuestion } from '../../services/dataFormatters';
```

Thay thế mock questions bằng:
```typescript
const [questions, setQuestions] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadQuestions();
}, []);

const loadQuestions = async () => {
  try {
    setLoading(true);
    const response = await questionsAPI.getAll();
    if (response.success) {
      const formatted = response.data.map(formatQuestion);
      setQuestions(formatted);
    }
  } catch (error) {
    console.error('Error loading questions:', error);
  } finally {
    setLoading(false);
  }
};

const handleAskQuestion = async (title: string, content: string, topic: string) => {
  const user = authAPI.getCurrentUser();
  if (!user) return;
  
  try {
    const response = await questionsAPI.create({
      title,
      content,
      topic,
      userId: user.id,
      tags: []
    });
    
    if (response.success) {
      // Reload questions
      loadQuestions();
    }
  } catch (error) {
    console.error('Error creating question:', error);
  }
};
```

### 2. **Contests Screen** (`src/components/student/ContestsScreen.tsx`)

```typescript
import { useEffect, useState } from 'react';
import { contestsAPI, authAPI } from '../../services/api';
import { formatContest } from '../../services/dataFormatters';

const [contests, setContests] = useState([]);

useEffect(() => {
  loadContests();
}, []);

const loadContests = async () => {
  try {
    const response = await contestsAPI.getAll();
    if (response.success) {
      const formatted = response.data.map(formatContest);
      setContests(formatted);
    }
  } catch (error) {
    console.error('Error loading contests:', error);
  }
};

const handleRegister = async (contestId: string) => {
  const user = authAPI.getCurrentUser();
  if (!user) return;
  
  try {
    const response = await contestsAPI.register(contestId, user.id);
    if (response.success) {
      // Reload contests
      loadContests();
    }
  } catch (error) {
    console.error('Error registering for contest:', error);
  }
};
```

### 3. **Consultation Sessions Screen** (`src/components/student/ConsultationSessionsScreen.tsx`)

```typescript
import { useEffect, useState } from 'react';
import { sessionsAPI, authAPI } from '../../services/api';
import { formatSession } from '../../services/dataFormatters';

const [mySessions, setMySessions] = useState([]);
const [upcomingSessions, setUpcomingSessions] = useState([]);

useEffect(() => {
  loadSessions();
}, []);

const loadSessions = async () => {
  const user = authAPI.getCurrentUser();
  if (!user) return;
  
  try {
    // Load my sessions
    const myResponse = await sessionsAPI.getAll('my', user.id);
    if (myResponse.success) {
      setMySessions(myResponse.data.map(formatSession));
    }
    
    // Load upcoming sessions
    const upcomingResponse = await sessionsAPI.getAll('upcoming');
    if (upcomingResponse.success) {
      setUpcomingSessions(upcomingResponse.data.map(formatSession));
    }
  } catch (error) {
    console.error('Error loading sessions:', error);
  }
};

const handleJoinSession = async (sessionId: string) => {
  const user = authAPI.getCurrentUser();
  if (!user) return;
  
  try {
    const response = await sessionsAPI.join(sessionId, user.id);
    if (response.success) {
      loadSessions();
    }
  } catch (error) {
    console.error('Error joining session:', error);
  }
};
```

### 4. **Find Tutor Screen** (`src/components/student/FindTutorScreen.tsx`)

```typescript
import { useEffect, useState } from 'react';
import { tutorsAPI, authAPI } from '../../services/api';
import { formatTutor } from '../../services/dataFormatters';

const [tutors, setTutors] = useState([]);
const [suggestions, setSuggestions] = useState([]);

useEffect(() => {
  loadTutors();
}, []);

const loadTutors = async () => {
  const user = authAPI.getCurrentUser();
  
  try {
    // Load all tutors
    const allResponse = await tutorsAPI.getAll();
    if (allResponse.success) {
      setTutors(allResponse.data.map(formatTutor));
    }
    
    // Load suggestions
    if (user) {
      const suggestionsResponse = await tutorsAPI.getSuggestions(user.id);
      if (suggestionsResponse.success) {
        setSuggestions(suggestionsResponse.data.map(formatTutor));
      }
    }
  } catch (error) {
    console.error('Error loading tutors:', error);
  }
};
```

## 🚀 Cách chạy

### Backend:
```bash
cd server
npm install
npm run seed    # Tạo dữ liệu mẫu
npm start       # Port 3001
```

### Frontend:
```bash
npm install
npm run dev     # Port 3000
```

## 🔐 Demo Accounts

| Role | BKnetID | Password |
|------|---------|----------|
| Student | student | password |
| Tutor | tutor | password |
| CoD | cod | password |
| CTSV | ctsv | password |

## 📌 Lưu ý quan trọng

1. **User ID**: Sau khi login, user.id được lưu trong localStorage. Sử dụng `authAPI.getCurrentUser()` để lấy user hiện tại

2. **Token**: JWT token được tự động gửi trong header của mọi API request

3. **Error Handling**: Luôn wrap API calls trong try-catch và hiển thị error cho user

4. **Loading States**: Thêm loading indicators khi fetch data

5. **Real-time Updates**: Sau khi tạo/update data, gọi lại load function để refresh danh sách

## 🔄 Pattern chung cho mọi screen

```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    setLoading(true);
    const response = await API.method();
    if (response.success) {
      setData(response.data.map(formatter));
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

## 📂 File structure

```
src/
├── services/
│   ├── api.ts              # API calls
│   └── dataFormatters.ts   # Format backend data
├── components/
│   ├── auth/
│   │   ├── LoginScreen.tsx     ✅ Done
│   │   └── RegisterScreen.tsx  ✅ Done
│   ├── student/
│   │   ├── QAScreen.tsx           ⏳ Update needed
│   │   ├── ContestsScreen.tsx     ⏳ Update needed
│   │   ├── ConsultationSessionsScreen.tsx  ⏳ Update needed
│   │   └── FindTutorScreen.tsx    ⏳ Update needed
│   └── tutor/
│       ├── TutorQAScreen.tsx      ⏳ Update needed
│       └── ConsultationScreen.tsx ⏳ Update needed
```

## ✅ Checklist

- [x] API Service Layer
- [x] Data Formatters
- [x] Login Screen
- [x] Register Screen
- [ ] Student Q&A Screen
- [ ] Contests Screen
- [ ] Sessions Screen
- [ ] Find Tutor Screen
- [ ] Tutor Q&A Screen
- [ ] Tutor Consultation Screen

Sau khi cập nhật các màn hình, dữ liệu sẽ được lưu thực sự vào MongoDB và đồng bộ giữa các sessions!
