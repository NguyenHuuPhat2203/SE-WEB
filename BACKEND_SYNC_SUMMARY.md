# Backend Integration Summary

## Tổng quan
Đã đồng bộ hoàn toàn backend MongoDB cho tất cả các role (Student, Tutor, COD, CTSV) và các tính năng chính.

## Các thay đổi đã thực hiện

### 1. Backend APIs mới
**File: `server/controllers/reportController.js`**
- `studentActivity`: Lấy báo cáo hoạt động của sinh viên (cho CTSV)
- `courseStatistics`: Lấy thống kê môn học từ sessions

**File: `server/services/reportService.js`**
- `getStudentActivityReport()`: Tính toán activity score dựa trên:
  - Số buổi tư vấn tham gia × 5
  - Số cuộc thi tham gia × 10  
  - Số câu hỏi đã hỏi × 3
  - Đánh giá trung bình × 10
- `getCourseStatistics()`: Thống kê sessions theo subject

**File: `server/server.js`**
- Thêm routes: `/api/reports/student-activity`, `/api/reports/course-statistics`

### 2. Frontend API Service
**File: `src/services/api.ts`**
- Thêm `reportsAPI`:
  - `getStudentActivity(semester?, department?)`
  - `getCourseStatistics()`

### 3. Student Screens - ĐÃ ĐỒNG BỘ ✅

#### ContestsScreen.tsx
- ✅ Load contests từ `contestsAPI.getAll()`
- ✅ Đăng ký contest qua `contestsAPI.register(id, userId)`
- ✅ Loading states và error handling
- ✅ Real-time participant count updates

#### ConsultationSessionsScreen.tsx
- ✅ Load sessions từ `sessionsAPI.getAll()`
- ✅ Tham gia session qua `sessionsAPI.join(id, userId)`
- ✅ Tách sessions thành "My sessions" và "Upcoming" dựa trên user participation
- ✅ Loading states và error handling

#### FindTutorScreen.tsx
- ✅ Load tutors từ `tutorsAPI.getAll()`
- ✅ Display tutor profiles từ database
- ✅ Loading states và error handling

#### QAScreen.tsx (đã hoàn thành trước đó)
- ✅ Load questions từ `questionsAPI.getAll()`
- ✅ Tạo câu hỏi mới qua `questionsAPI.create()`
- ✅ Real-time question updates

### 4. Tutor Screens - ĐÃ ĐỒNG BỘ ✅

#### TutorQAScreen.tsx (đã hoàn thành trước đó)
- ✅ Load questions từ `questionsAPI.getAll()`
- ✅ Trả lời câu hỏi qua `questionsAPI.addAnswer(id, data)`
- ✅ Đồng bộ câu hỏi giữa student và tutor

### 5. CTSV Role - ĐÃ ĐỒNG BỘ ✅

#### ScholarshipEvaluationScreen.tsx
- ✅ Load student activity data từ `reportsAPI.getStudentActivity()`
- ✅ Lọc theo semester và department
- ✅ Hiển thị:
  - Số buổi tư vấn tham gia
  - Số cuộc thi tham gia  
  - Số câu hỏi đã hỏi
  - Đánh giá trung bình
  - Activity score (tự động tính)
- ✅ Badge rating: Excellent (≥90), Good (≥75), Fair (<75)
- ✅ Loading states và error handling

### 6. COD Role - CHƯA HOÀN TOÀN

#### ManageCoursesScreen.tsx
- ⚠️ Vẫn sử dụng mock data (courses chưa có model trong backend)
- 📝 Thêm comment hướng dẫn integrate với `reportsAPI.getCourseStatistics()`
- 💡 **Để hoàn thiện**: Cần tạo Course model và CRUD endpoints

## Database Models hiện có

1. **User** - Người dùng (student, tutor, cod, ctsv)
2. **Tutor** - Thông tin cố vấn
3. **Contest** - Cuộc thi
4. **Session** - Buổi tư vấn
5. **Question** - Câu hỏi Q&A với answers array

## API Endpoints đầy đủ

### Authentication
- POST `/api/login` - Đăng nhập
- POST `/api/register` - Đăng ký
- POST `/api/password/search` - Tìm tài khoản
- POST `/api/password/reset` - Đặt lại mật khẩu

### Contests
- GET `/api/contests` - Danh sách contests
- GET `/api/contests/:id` - Chi tiết contest
- POST `/api/contests/:id/register` - Đăng ký contest

### Sessions
- GET `/api/sessions` - Danh sách sessions
- GET `/api/sessions/:id` - Chi tiết session
- POST `/api/sessions/:id/join` - Tham gia session

### Tutors
- GET `/api/tutors` - Danh sách tutors
- GET `/api/tutors/:id` - Chi tiết tutor
- GET `/api/tutors/departments` - Danh sách khoa
- GET `/api/tutors/specializations` - Danh sách chuyên môn
- GET `/api/tutors/suggestions` - Gợi ý tutors

### Questions (Q&A)
- GET `/api/questions` - Danh sách câu hỏi
- POST `/api/questions` - Tạo câu hỏi mới
- GET `/api/questions/:id` - Chi tiết câu hỏi
- POST `/api/questions/:id/answer` - Trả lời câu hỏi

### Reports (mới)
- GET `/api/reports/student-activity?semester=&department=` - Báo cáo hoạt động sinh viên
- GET `/api/reports/course-statistics` - Thống kê môn học

## Cách chạy ứng dụng

### Backend
```bash
cd server
npm install
npm run seed    # Tạo dữ liệu demo
npm start       # Chạy server trên port 3001
```

### Frontend
```bash
npm install
npm run dev     # Chạy trên port 3000
```

### Tài khoản demo
- Student: `student` / `password`
- Tutor: `tutor` / `password`
- COD: `cod` / `password`
- CTSV: `ctsv` / `password`

## Test scenarios

### 1. Q&A synchronization (✅ Hoạt động)
1. Đăng nhập bằng student
2. Tạo câu hỏi mới trong Q&A
3. Đăng xuất và đăng nhập lại bằng tutor
4. Thấy câu hỏi vừa tạo và có thể trả lời
5. Student có thể thấy câu trả lời

### 2. Contest registration (✅ Hoạt động)
1. Đăng nhập bằng student
2. Xem danh sách contests
3. Đăng ký contest
4. Số participants tăng lên

### 3. Session participation (✅ Hoạt động)
1. Đăng nhập bằng student
2. Xem danh sách sessions
3. Tham gia session
4. Session xuất hiện trong "My sessions"

### 4. Find Tutor (✅ Hoạt động)
1. Đăng nhập bằng student
2. Tìm kiếm tutors
3. Xem profile chi tiết tutors từ database

### 5. CTSV Scholarship Evaluation (✅ Hoạt động)
1. Đăng nhập bằng ctsv
2. Xem báo cáo hoạt động sinh viên
3. Lọc theo semester/department
4. Xuất báo cáo (toast notification)

## Những gì còn lại

### COD Role
- [ ] Tạo Course model trong backend
- [ ] Thêm CRUD endpoints cho courses
- [ ] Tích hợp ManageCoursesScreen với real API
- [ ] Tích hợp CourseRequestsScreen với real API
- [ ] Tích hợp ManageStaffScreen với real API

### Tính năng nâng cao (tùy chọn)
- [ ] Real-time notifications với WebSocket
- [ ] File upload cho contests/sessions
- [ ] Advanced search/filter cho tất cả screens
- [ ] Pagination cho danh sách dài
- [ ] Export CSV/PDF cho reports
- [ ] Email notifications
- [ ] Calendar integration cho sessions

## Kiến trúc tổng quan

```
Frontend (React + TypeScript)
    ↓ HTTP requests
Backend (Express + Node.js)
    ↓ Mongoose queries
MongoDB Atlas
```

### Data flow
1. User tương tác với UI component
2. Component gọi API service (`api.ts`)
3. API service gửi HTTP request đến backend
4. Backend controller xử lý request
5. Controller gọi service layer
6. Service gọi repository/model
7. Repository truy vấn MongoDB
8. Data flow ngược lại qua formatters
9. UI cập nhật với data mới

## Lưu ý quan trọng

1. **Authentication**: JWT token được lưu trong localStorage
2. **Error handling**: Tất cả API calls đều có try-catch và toast notifications
3. **Loading states**: Tất cả screens có loading indicators
4. **Data formatting**: `dataFormatters.ts` chuyển đổi MongoDB data sang frontend format
5. **CORS**: Backend enable CORS cho frontend port 3000
6. **Environment**: Backend config trong `.env` file

## Performance considerations

- Sử dụng `populate()` trong Mongoose để eager load related data
- Không có pagination (cần implement cho production)
- Index MongoDB fields được query thường xuyên
- Cache API responses trong component state

## Security considerations

- Password được hash với bcrypt
- JWT token cho authentication
- Input validation cần cải thiện
- Rate limiting chưa implement
- HTTPS chưa enable (development only)
