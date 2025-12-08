import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { LoginScreen } from "../components/auth/LoginScreen";
import { RegisterScreen } from "../components/auth/RegisterScreen";
import { PasswordRecoveryScreen } from "../components/auth/PasswordRecoveryScreen";
import { MainLayout } from "../components/layouts/MainLayout";

// Student
import { StudentHome } from "../components/student/StudentHome";
import { FindTutorScreen } from "../components/student/FindTutorScreen";
import { StudentNotifications } from "../components/student/StudentNotifications";
import { FeedbackScreen } from "../components/student/FeedbackScreen";
import { QAScreen } from "../components/student/QAScreen";
import { PersonalizationScreen } from "../components/student/PersonalizationScreen";
import { ContestsScreen } from "../components/student/ContestsScreen";
import { ConsultationSessionsScreen } from "../components/student/ConsultationSessionsScreen";
import { RequestCoursesScreen } from "../components/student/RequestCoursesScreen";
import { CourseDetailScreen } from "../components/student/CourseDetailScreen";
import { ResourceLibraryScreen } from "../components/student/ResourceLibraryScreen";
import { ResourceDetailScreen } from "../components/student/ResourceDetailScreen";
import { PerformanceAnalyticsScreen } from "../components/student/PerformanceAnalyticsScreen";
import { TutorDetailScreen } from "../components/student/TutorDetailScreen";
import { ContestDetailScreen } from "../components/student/ContestDetailScreen";

// Tutor
import { TutorHome } from "../components/tutor/TutorHome";
import { ConsultationScreen } from "../components/tutor/ConsultationScreen";
import { TutorContestsScreen } from "../components/tutor/TutorContestsScreen";
import { ConsultationSessionDetailScreen } from "../components/tutor/ConsultationSessionDetailScreen";

// Shared
import { QuestionDetailScreen } from "../components/shared/QuestionDetailScreen";
import { ReportsScreen } from "../components/shared/ReportsScreen";

// CoD
import { CoDHome } from "../components/cod/CoDHome";
import { ManageCoursesAndRequests } from "../components/cod/ManageCoursesScreen";
import { CourseRequestsScreen } from "../components/cod/CourseRequestsScreen";
import { ManageStaffScreen } from "../components/cod/ManageStaffScreen";

// CTSV
import { CTSVHome } from "../components/ctsv/CTSVHome";
import { ScholarshipEvaluationScreen } from "../components/ctsv/ScholarshipEvaluationScreen";

export function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginScreen />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <RegisterScreen />}
      />
      <Route
        path="/recover-password"
        element={
          user ? <Navigate to="/" replace /> : <PasswordRecoveryScreen />
        }
      />

      {/* Protected routes with layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Student routes */}
        <Route index element={<HomeRedirect />} />
        <Route path="student">
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="find-tutor"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <FindTutorScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="tutor/:tutorId"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <TutorDetailScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="notifications"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentNotifications allowCompose />
              </ProtectedRoute>
            }
          />
          <Route
            path="feedback"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <FeedbackScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="qa"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <QAScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="qa/:questionId"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <QuestionDetailScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="personalization"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <PersonalizationScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="contests"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <ContestsScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="contests/:contestId"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <ContestDetailScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="consultation-sessions"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <ConsultationSessionsScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="consultation-sessions/:sessionId"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <ConsultationSessionDetailScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="request-courses"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <RequestCoursesScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="courses/:courseId"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <CourseDetailScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="resources"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <ResourceLibraryScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="resources/:resourceId"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <ResourceDetailScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <PerformanceAnalyticsScreen />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Tutor routes */}
        <Route path="tutor">
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={["tutor"]}>
                <TutorHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="notifications"
            element={
              <ProtectedRoute allowedRoles={["tutor"]}>
                <StudentNotifications allowCompose />
              </ProtectedRoute>
            }
          />
          <Route
            path="consultation"
            element={
              <ProtectedRoute allowedRoles={["tutor"]}>
                <ConsultationScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="consultation/:sessionId"
            element={
              <ProtectedRoute allowedRoles={["tutor"]}>
                <ConsultationSessionDetailScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="qa"
            element={
              <ProtectedRoute allowedRoles={["tutor"]}>
                <QAScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="qa/:questionId"
            element={
              <ProtectedRoute allowedRoles={["tutor"]}>
                <QuestionDetailScreen isTutor />
              </ProtectedRoute>
            }
          />
          <Route
            path="contests"
            element={
              <ProtectedRoute allowedRoles={["tutor"]}>
                <TutorContestsScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="contests/:contestId"
            element={
              <ProtectedRoute allowedRoles={["tutor"]}>
                <ContestDetailScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="personalization"
            element={
              <ProtectedRoute allowedRoles={["tutor"]}>
                <PersonalizationScreen isTutor />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* CoD routes */}
        <Route path="cod">
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={["cod"]}>
                <CoDHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="manage-courses"
            element={
              <ProtectedRoute allowedRoles={["cod"]}>
                <ManageCoursesAndRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="course-requests"
            element={
              <ProtectedRoute allowedRoles={["cod"]}>
                <CourseRequestsScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="manage-staff"
            element={
              <ProtectedRoute allowedRoles={["cod"]}>
                <ManageStaffScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute allowedRoles={["cod"]}>
                <ReportsScreen />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* CTSV routes */}
        <Route path="ctsv">
          <Route
            index
            element={
              <ProtectedRoute allowedRoles={["ctsv"]}>
                <CTSVHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="scholarship"
            element={
              <ProtectedRoute allowedRoles={["ctsv"]}>
                <ScholarshipEvaluationScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute allowedRoles={["ctsv"]}>
                <ReportsScreen />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Helper component to redirect to role-specific home
function HomeRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const roleRoutes = {
    student: "/student",
    tutor: "/tutor",
    cod: "/cod",
    ctsv: "/ctsv",
  };

  return <Navigate to={roleRoutes[user.role]} replace />;
}
