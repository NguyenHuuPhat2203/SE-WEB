# SE-WEB Project Report (Tiếng Việt)

## Tổng quan

- Ứng dụng hỗ trợ Tutor: frontend React (Vite), backend Express, dữ liệu demo in-memory (không DB/auth token).
- Cổng: frontend 3000 (`npm run dev`), backend 3001 (`node server.js`).
- Mục tiêu: demo login/điều hướng theo vai trò (student/tutor/cod/ctsv), contests, sessions, Q&A, notifications, course requests.

## Công nghệ

- Frontend: React 18, Vite, Radix UI (shadcn-like), lucide-react icons, sonner toasts.
- Backend: Node.js, Express 5, CORS, parse JSON qua `express.json()`.
- Data: mảng in-memory; khởi động lại sẽ mất.

## Chạy dự án

- Backend: `cd server && npm install && node server.js` (port 3001).
- Frontend: `npm install && npm run dev` (port 3000).

## Kiến trúc Backend

- Entry: `server/server.js`
  - Bật CORS, parse JSON.
  - Đăng ký toàn bộ routes; không có auth middleware.
- Models (class đơn giản, in-memory): `User`, `Tutor`, `Contest`, `Session`, `Question`.
- Repositories (bộ sưu tập in-memory):
  - `userRepository`: user demo (student, tutor, cod, ctsv), password lưu plain, APIs thông báo, cập nhật profile, reset password.
  - `tutorRepository`: 3 tutor với department/specialization/rating.
  - `contestRepository`: 3 contest, `register` tăng participants nếu open.
  - `sessionRepository`: 5 session, `join` kiểm tra capacity, mySessionIds demo.
  - `questionRepository`: 3 câu hỏi, `create` thêm mới.
- Services: lớp mỏng kiểm tra/ủy quyền repo (`authService`, `contestService`, `sessionService`, `tutorService`, `qaService`).
- Controllers / Routes (trả JSON, không auth):
  - Auth: `POST /api/login`, `POST /api/register`, `POST /api/password/search`, `POST /api/password/reset` (captcha cố định `CAPTCHA`).
  - User: `PATCH /api/users/:bknetId/profile` (student: department, stuId; tutor: tutorId, faculty, listCourseCanTeach, education, awards); `GET /api/users` debug không trả password.
  - Contests (hard-code trong controller, không dùng contestService):
    - `GET /api/contests` (lọc `type=academic|non-academic|all`).
    - `GET /api/contests/:id` chi tiết.
    - `POST /api/contests/:id/register` tăng participants, chặn closed/full.
    - `POST /api/addcontest` tạo contest (status=open, maxParticipants=100).
  - Sessions (hard-code trong controller):
    - `GET /api/sessions` (optional `type`).
    - `GET /api/sessions/:id` chi tiết.
    - `POST /api/sessions/:id/join` body `{ id, name, status? }` thêm student.
    - `POST /api/addsession` tạo session.
  - Tutors: `GET /api/tutors`, `GET /api/tutors/:id`, `GET /api/tutors/suggestions`, `GET /api/tutors/departments`, `GET /api/tutors/specializations`.
  - Q&A (data cục bộ trong controller): `GET /api/getquestions`, `GET /api/questions/:id`, `POST /api/addquestion`, `POST /api/questions/:id/answers`.
  - Notifications: `GET /api/notifications?bknetId=...`, `POST /api/addnotification`, `PATCH /api/notifications/:id/read`, `GET /api/notifications/unread-count`.
  - Courses: `GET /api/courses`, `POST /api/courses`, `PUT /api/courses/:id`, `DELETE /api/courses/:id`.
  - Course requests: `GET /api/course-requests`, `POST /api/addcourse-request`, `PATCH /api/course-requests/:id/approve`, `PATCH /api/course-requests/:id/reject`.

## Kiến trúc Frontend

- Entry: `src/main.tsx` render `App`.
- `App.tsx` state: `currentScreen`, `user`, `language`, các ID chọn (tutor, contest, course, question, session, resource); `unreadNotifications` dummy; handler login/logout, toggle ngôn ngữ, điều hướng.
- Điều hướng theo vai trò qua `Sidebar` + `TopAppBar`; màn hình switch bằng `currentScreen`.
- Màn hình chính (gọi backend):
  - `LoginScreen`: POST `/api/login`.
  - `QAScreen`: GET `/api/getquestions`; POST `/api/addquestion` (author = bknetId); POST `/api/questions/:id/answers`.
  - `ContestsScreen`: GET `/api/contests`; GET `/api/contests/:id`; POST `/api/contests/:id/register`; search/filter client-side.
  - `ConsultationSessionsScreen`: GET `/api/sessions`; POST `/api/sessions/:id/join` gửi thông tin user.
- Màn hình khác (Home, Notifications, Feedback, Resources, Reports, Personalization, Tutor/CoD/CTSV) chủ yếu UI/demo, chưa thấy nối API trong trích xuất hiện tại.

## Luồng dữ liệu

- Không có authentication token; FE gọi trực tiếp BE `http://localhost:3001`.
- Server lưu in-memory; restart mất dữ liệu.
- Một số controller bỏ qua service/repo (contests, sessions, qa) → trùng lặp logic.

## Vấn đề / Rủi ro

### ⚠️ Đã được cải thiện:

- ~~Không hashing password~~ → ✅ **Đã implement PBKDF2 hashing** (cần update demo passwords)
- ~~Không validation~~ → ✅ **Đã thêm comprehensive validation** (utils/validation.js)
- ~~CORS mở mọi origin~~ → ✅ **Config-based CORS** (.env)
- ~~Không error handling~~ → ✅ **Global error handler** + standardized responses
- ~~Lỗi import QAScreen~~ → ✅ **Đã fix** (xóa import sai từ server/models/User)

### 🔴 Vẫn tồn tại:

- Không enforce auth/roles → Cần implement JWT middleware
- Storage in-memory, mất dữ liệu khi restart → Cần migrate sang database
- Controller hard-code vs service/repo → Cần refactor
- Captcha cố định → Cần integrate reCAPTCHA/hCaptcha
- Không rate limiting trên routes → Đã code sẵn middleware, chưa apply
- Chưa có input sanitization ngoài kiểm tra thiếu trường → Đã có basic sanitization

## Cải tiến đã thực hiện (Dec 2025)

### 🔐 Bảo mật

1. **Password Hashing**: PBKDF2 với salt (utils/password.js)
2. **Input Validation**: Comprehensive validation (utils/validation.js)
3. **XSS Prevention**: Basic string sanitization
4. **Rate Limiting**: In-memory rate limiter (middleware/rateLimiter.js)
5. **CORS Configuration**: Environment-based CORS settings

### 🏗️ Kiến trúc

1. **Config Management**: Centralized config với dotenv (utils/config.js)
2. **Response Standardization**: Unified API responses (utils/response.js)
3. **Error Handling**: Global error handler + async wrapper (middleware/errorHandler.js)
4. **Environment Setup**: .env, .env.example, .gitignore

### 🐛 Bug Fixes

1. Fixed import error trong QAScreen.tsx
2. Improved error messages trong authController
3. Added request logging (development mode)

### 📦 Dependencies

- Added: `dotenv` (environment config)
- Added: `nodemon` (dev dependency, auto-reload)

Xem chi tiết trong `server/IMPROVEMENTS.md`

## Đề xuất tiếp theo

1. Thêm DB (Postgres/Mongo) và thay repo bằng storage thật.
2. Bổ sung auth (JWT/session), hashing password, middleware role-based.
3. Hợp nhất controller dùng service/repo; gom contest/session/qa về chung nguồn dữ liệu.
4. Sửa type/import frontend (bỏ `import { user } from "server/models/User"` trong `QAScreen`).
5. Cải thiện UX frontend: loading states, error toast, optimistic update cho join/register/post.
6. Thêm validation layer (zod/yup) và response lỗi nhất quán.
