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

- Không hashing password, không enforce auth/roles, captcha cố định, không rate limiting.
- Storage in-memory, mất dữ liệu khi restart.
- Lỗi import: `QAScreen` import `server/models/User` (sai); nên dùng type `User` từ `App.tsx`.
- Mẫu code pha trộn: controller hard-code vs service/repo; validation/error handling không nhất quán.
- CORS mở mọi origin; chưa có input sanitization ngoài kiểm tra thiếu trường.

## Đề xuất tiếp theo

1. Thêm DB (Postgres/Mongo) và thay repo bằng storage thật.
2. Bổ sung auth (JWT/session), hashing password, middleware role-based.
3. Hợp nhất controller dùng service/repo; gom contest/session/qa về chung nguồn dữ liệu.
4. Sửa type/import frontend (bỏ `import { user } from "server/models/User"` trong `QAScreen`).
5. Cải thiện UX frontend: loading states, error toast, optimistic update cho join/register/post.
6. Thêm validation layer (zod/yup) và response lỗi nhất quán.
