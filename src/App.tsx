import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { TopAppBar } from './components/TopAppBar';
import { authAPI } from './services/api';
import { Sidebar } from './components/Sidebar';
import { LoginScreen } from './components/auth/LoginScreen';
import { RegisterScreen } from './components/auth/RegisterScreen';
import { PasswordRecoveryScreen } from './components/auth/PasswordRecoveryScreen';
import { StudentHome } from './components/student/StudentHome';
import { FindTutorScreen } from './components/student/FindTutorScreen';
import { StudentNotifications } from './components/student/StudentNotifications';
import { FeedbackScreen } from './components/student/FeedbackScreen';
import { QAScreen } from './components/student/QAScreen';
import { PersonalizationScreen } from './components/student/PersonalizationScreen';
import { ContestsScreen } from './components/student/ContestsScreen';
import { ConsultationSessionsScreen } from './components/student/ConsultationSessionsScreen';
import { RequestCoursesScreen } from './components/student/RequestCoursesScreen';
import { CourseDetailScreen } from './components/student/CourseDetailScreen';
import { ResourceLibraryScreen } from './components/student/ResourceLibraryScreen';
import { ResourceDetailScreen } from './components/student/ResourceDetailScreen';
import { PerformanceAnalyticsScreen } from './components/student/PerformanceAnalyticsScreen';
import { TutorDetailScreen } from './components/student/TutorDetailScreen';
import { ContestDetailScreen } from './components/student/ContestDetailScreen';
import { ContestStartScreen } from './components/student/ContestStartScreen';
import { TakeContestScreen } from './components/student/TakeContestScreen';
import { TutorHome } from './components/tutor/TutorHome';
import { ConsultationScreen } from './components/tutor/ConsultationScreen';
import { TutorQAScreen } from './components/tutor/TutorQAScreen';
import { TutorContestsScreen } from './components/tutor/TutorContestsScreen';
import { QuestionDetailScreen } from './components/shared/QuestionDetailScreen';
import { ConsultationSessionDetailScreen } from './components/tutor/ConsultationSessionDetailScreen';
import { CoDHome } from './components/cod/CoDHome';
// import { ManageCoursesScreen } from './components/cod/ManageCoursesScreen';
import { ManageCoursesAndRequests } from './components/cod/ManageCoursesScreen';
import { CourseRequestsScreen } from './components/cod/CourseRequestsScreen';
import { ManageStaffScreen } from './components/cod/ManageStaffScreen';
import { ReportsScreen } from './components/shared/ReportsScreen';
import { CTSVHome } from './components/ctsv/CTSVHome';
import { ScholarshipEvaluationScreen } from './components/ctsv/ScholarshipEvaluationScreen';

export type UserRole = 'student' | 'tutor' | 'cod' | 'ctsv';
export type Language = 'vi' | 'en';

interface User {
  name: string;
  role: UserRole;
  avatar: string;
  bknetId: string;
  faculty?: string;
  department?: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>('login');
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [unreadNotifications, setUnreadNotifications] = useState(5);
  const [selectedTutorId, setSelectedTutorId] = useState<number>(1);
  const [selectedContestId, setSelectedContestId] = useState<number>(1);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(1);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(1);
  const [selectedConsultationSessionId, setSelectedConsultationSessionId] = useState<number>(1);
  const [selectedResourceId, setSelectedResourceId] = useState<number>(1);

  // Check for existing session on mount
  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    if (currentUser) {
      const appUser: User = {
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        role: currentUser.role,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        bknetId: currentUser.bknetId,
        faculty: currentUser.role === 'student' ? 'Computer Science' : undefined,
        department: currentUser.role !== 'student' ? 'Computer Science' : undefined
      };
      setUser(appUser);
      setCurrentScreen('home');
    }
  }, []);

  const handleLogin = (bknetId: string, role: UserRole) => {
    // Get user from localStorage (saved by authAPI.login)
    const currentUser = authAPI.getCurrentUser();
    if (currentUser) {
      const appUser: User = {
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        role: currentUser.role,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        bknetId: currentUser.bknetId,
        faculty: currentUser.role === 'student' ? 'Computer Science' : undefined,
        department: currentUser.role !== 'student' ? 'Computer Science' : undefined
      };
      setUser(appUser);
      setCurrentScreen('home');
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    setCurrentScreen('login');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'vi' : 'en');
  };

  const renderContent = () => {
    // Auth screens
    if (currentScreen === 'login') {
      return (
        <LoginScreen
          onLogin={handleLogin}
          onNavigate={setCurrentScreen}
          language={language}
        />
      );
    }

    if (currentScreen === 'register') {
      return (
        <RegisterScreen
          onNavigate={setCurrentScreen}
          language={language}
        />
      );
    }

    if (currentScreen === 'recover-password') {
      return (
        <PasswordRecoveryScreen
          onNavigate={setCurrentScreen}
          language={language}
        />
      );
    }

    // Main app screens (with layout)
    if (!user) return null;

    return (
      <div className="flex h-screen bg-background">
        <Sidebar
          role={user.role}
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          onLogout={handleLogout}
          language={language}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopAppBar
            user={user}
            unreadNotifications={unreadNotifications}
            language={language}
            onToggleLanguage={toggleLanguage}
            onLogout={handleLogout}
          />
          <main className="flex-1 overflow-y-auto">
            {renderMainContent()}
          </main>
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    if (!user) return null;

    // Student screens
    if (user.role === 'student') {
      switch (currentScreen) {
        case 'home':
          return (
            <StudentHome
              onNavigate={(screen, sessionId) => {
                if (sessionId) setSelectedConsultationSessionId(sessionId);
                setCurrentScreen(screen);
              }}
              language={language}
              user={user}
            />
          );
        case 'find-tutor':
          return (
            <FindTutorScreen
              language={language}
              onNavigate={(screen, tutorId) => {
                if (tutorId) setSelectedTutorId(tutorId);
                if (screen) setCurrentScreen(screen);
              }}
            />
          );
        case 'notifications':
          return <StudentNotifications language={language} onUnreadChange={setUnreadNotifications} allowCompose />;
        case 'feedback':
          return <FeedbackScreen language={language} />;
        case 'qa':
          return (
            <QAScreen
              language={language}
              onNavigate={(screen, questionId) => {
                if (questionId) setSelectedQuestionId(questionId);
                if (screen) setCurrentScreen(screen);
              }}
            />
          );
        case 'personalization':
          return <PersonalizationScreen language={language} />;
        case 'contests':
          return (
            <ContestsScreen
              language={language}
              onViewContest={(contestId) => {
                setSelectedContestId(contestId);
                setCurrentScreen('contest-detail');
              }}
              onStartContest={(contestId) => {
                setSelectedContestId(contestId);
                setCurrentScreen('contest-start');
              }}
            />
          );
        case 'consultation-sessions':
          return <ConsultationSessionsScreen language={language} />;
        case 'request-courses':
          return <RequestCoursesScreen language={language} onNavigate={(screen, courseId) => {
            if (courseId) setSelectedCourseId(courseId);
            setCurrentScreen(screen);
          }} />;
        case 'course-detail':
          return <CourseDetailScreen language={language} courseId={selectedCourseId} onBack={() => setCurrentScreen('request-courses')} />;
        case 'resources':
          return (
            <ResourceLibraryScreen
              language={language}
              onNavigate={(screen, resourceId) => {
                if (resourceId) setSelectedResourceId(resourceId);
                if (screen) setCurrentScreen(screen);
              }}
            />
          );
        case 'resource-detail':
          return (
            <ResourceDetailScreen
              language={language}
              resourceId={selectedResourceId}
              onBack={() => setCurrentScreen('resources')}
            />
          );
        case 'analytics':
          return <PerformanceAnalyticsScreen language={language} />;
        case 'tutor-detail':
          return <TutorDetailScreen language={language} tutorId={selectedTutorId} onBack={() => setCurrentScreen('find-tutor')} />;
        case 'contest-detail':
          return (
            <ContestDetailScreen 
              language={language} 
              contestId={selectedContestId} 
              onBack={() => setCurrentScreen('contests')}
              onStartContest={() => setCurrentScreen('contest-start')}
            />
          );
        case 'contest-start':
          return (
            <ContestStartScreen
              language={language}
              contestId={selectedContestId.toString()}
              onBack={() => setCurrentScreen('contests')}
              onStartContest={() => setCurrentScreen('take-contest')}
            />
          );
        case 'take-contest':
          return <TakeContestScreen language={language} contestId={selectedContestId.toString()} onBack={() => setCurrentScreen('contest-start')} />;
        case 'question-detail':
          return <QuestionDetailScreen language={language} questionId={selectedQuestionId} onBack={() => setCurrentScreen('qa')} />;
        case 'consultation-session-detail':
          return (
            <ConsultationSessionDetailScreen
              language={language}
              sessionId={selectedConsultationSessionId}
              onBack={() => setCurrentScreen('home')}
            />
          );
        default:
          return (
            <StudentHome
              onNavigate={(screen, sessionId) => {
                if (sessionId) setSelectedConsultationSessionId(sessionId);
                setCurrentScreen(screen);
              }}
              language={language}
              user={user}
            />
          );
      }
    }

    // Tutor screens
    if (user.role === 'tutor') {
      switch (currentScreen) {
        case 'home':
          return <TutorHome onNavigate={setCurrentScreen} language={language} user={user} />;
        case 'notifications':
          return <StudentNotifications language={language} onUnreadChange={setUnreadNotifications} allowCompose />;
        case 'consultation':
          return (
            <ConsultationScreen
              language={language}
              onNavigate={(screen, sessionId) => {
                if (sessionId) setSelectedConsultationSessionId(sessionId);
                if (screen) setCurrentScreen(screen);
              }}
            />
          );
        case 'qa':
          return (
            <TutorQAScreen
              language={language}
              onNavigate={(screen, questionId) => {
                if (questionId) setSelectedQuestionId(questionId);
                if (screen) setCurrentScreen(screen);
              }}
            />
          );
        case 'contests':
          return (
            <TutorContestsScreen
              language={language}
              onNavigate={(screen, contestId) => {
                if (contestId) setSelectedContestId(contestId);
                if (screen) setCurrentScreen(screen);
              }}
            />
          );
        case 'personalization':
          return <PersonalizationScreen language={language} isTutor />;
        case 'contest-detail':
          return (
            <ContestDetailScreen 
              language={language} 
              contestId={selectedContestId} 
              onBack={() => setCurrentScreen('contests')}
              onStartContest={() => setCurrentScreen('contest-start')}
            />
          );
        case 'contest-start':
          return (
            <ContestStartScreen
              language={language}
              contestId={selectedContestId.toString()}
              onBack={() => setCurrentScreen('contests')}
              onStartContest={() => setCurrentScreen('take-contest')}
            />
          );
        case 'take-contest':
          return <TakeContestScreen language={language} contestId={selectedContestId.toString()} onBack={() => setCurrentScreen('contest-start')} />;
        case 'question-detail':
          return <QuestionDetailScreen language={language} questionId={selectedQuestionId} onBack={() => setCurrentScreen('qa')} isTutor />;
        case 'consultation-session-detail':
          return (
            <ConsultationSessionDetailScreen
              language={language}
              sessionId={selectedConsultationSessionId}
              onBack={() => setCurrentScreen('consultation')}
            />
          );
        default:
          return <TutorHome onNavigate={setCurrentScreen} language={language} user={user} />;
      }
    }

    // CoD screens
    if (user.role === 'cod') {
      switch (currentScreen) {
        case 'home':
          return <CoDHome onNavigate={setCurrentScreen} language={language} />;
        case 'manage-courses':
          // return <ManageCoursesScreen language={language} onNavigate={setCurrentScreen} />;
          return <ManageCoursesAndRequests language={language} onNavigate={setCurrentScreen} />;
        case 'course-requests':
          return <CourseRequestsScreen language={language} />;
        case 'manage-staff':
          return <ManageStaffScreen language={language} />;
        case 'reports':
          return <ReportsScreen language={language} role="cod" />;
        default:
          return <CoDHome onNavigate={setCurrentScreen} language={language} />;
      }
    }

    // CTSV screens
    if (user.role === 'ctsv') {
      switch (currentScreen) {
        case 'home':
          return <CTSVHome onNavigate={setCurrentScreen} language={language} />;
        case 'scholarship':
          return <ScholarshipEvaluationScreen language={language} />;
        case 'reports':
          return <ReportsScreen language={language} role="ctsv" />;
        default:
          return <CTSVHome onNavigate={setCurrentScreen} language={language} />;
      }
    }

    return null;
  };

  return <div className="min-h-screen">
    {renderContent()}
    <Toaster />
  </div>;
}