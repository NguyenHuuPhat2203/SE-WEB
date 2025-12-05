import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { AlertCircle, GraduationCap } from 'lucide-react';
import type { Language, UserRole } from '../../App';

interface LoginScreenProps {
  onLogin: (bknetId: string, password: string) => void;
  onNavigate: (screen: string) => void;
  language: Language;
}

export function LoginScreen({ onLogin, onNavigate, language }: LoginScreenProps) {
  const [bknetId, setBknetId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  const t = {
    title: 'HCMUT',
    subtitle: language === 'en' ? 'Tutor Support System' : 'Hệ thống Cố vấn học tập',
    tagline: language === 'en'
      ? 'Connect with tutors and achieve your academic goals'
      : 'Kết nối với cố vấn và đạt được mục tiêu học tập',
    login: language === 'en' ? 'Log In' : 'Đăng nhập',
    createAccount: language === 'en' ? 'Register' : 'Tạo tài khoản mới',
    bknetId: 'BKnetID',
    password: language === 'en' ? 'Password' : 'Mật khẩu',
    forgotPassword: language === 'en' ? 'Forgotten password?' : 'Quên mật khẩu?',
    wrongInfo: language === 'en' ? 'Wrong information' : 'Sai thông tin',
    errorDesc: language === 'en' ? 'The BKnetID or password you entered is incorrect.' : 'BKnetID hoặc mật khẩu bạn nhập không đúng.',
    tryAgain: language === 'en' ? 'Try again' : 'Thử lại',
    recoverPassword: language === 'en' ? 'Recover password' : 'Khôi phục mật khẩu',
    loginAs: language === 'en' ? 'Demo - Login as:' : 'Demo - Đăng nhập với vai trò:',
  };

  const handleLogin = async () => {
    setError('');

    if (!bknetId.trim() || !password.trim()) {
      setError(language === 'en' ? 'Please fill in all fields' : 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bknetId, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || (language === 'en' ? 'Login failed' : 'Đăng nhập thất bại'));
        setShowErrorDialog(true);
        return;
      }

      // dùng role từ server
      onLogin(bknetId, password);
    } catch (err) {
      setError(language === 'en' ? 'Cannot connect to server' : 'Không thể kết nối server');
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Branding */}
          <div className="text-center md:text-left space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl text-purple-600">{t.title}</h1>
                <p className="text-gray-600 mt-1">{t.subtitle}</p>
              </div>
            </div>
            <p className="text-2xl text-gray-700 max-w-md mx-auto md:mx-0">
              {t.tagline}
            </p>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Input
                  id="bknetId"
                  type="text"
                  value={bknetId}
                  onChange={(e) => setBknetId(e.target.value)}
                  placeholder={t.bknetId}
                  className="h-12 px-4 bg-gray-50 border-gray-300"
                />

                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder={t.password}
                  className="h-12 px-4 bg-gray-50 border-gray-300"
                />
              </div>

              <Button
                onClick={handleLogin}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {t.login}
              </Button>

              <div className="text-center">
                <button
                  onClick={() => onNavigate('recover-password')}
                  className="text-purple-600 hover:underline"
                >
                  {t.forgotPassword}
                </button>
              </div>

              <div className="border-t border-gray-300 pt-4">
                <Button
                  onClick={() => onNavigate('register')}
                  variant="outline"
                  className="mx-auto block px-8 h-12 border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  {t.createAccount}
                </Button>
              </div>

              {/* Demo role selector */}
              <div className="pt-4 border-t border-gray-200">
                <Label className="text-xs text-gray-500 block mb-2">{t.loginAs}</Label>
                <div className="grid grid-cols-4 gap-2">
                  {(['student', 'tutor', 'cod', 'ctsv'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      className={`px-2 py-1.5 rounded text-xs transition-colors ${selectedRole === role
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      onClick={() => setSelectedRole(role)}
                      type="button"
                    >
                      {role === 'student' ? 'Student' : role === 'tutor' ? 'Tutor' : role === 'cod' ? 'CoD' : 'CTSV'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-200">
        <p>© 2025 HCMUT - Ho Chi Minh University of Technology</p>
      </footer>

      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.wrongInfo}</AlertDialogTitle>
            <AlertDialogDescription>{t.errorDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowErrorDialog(false)}>
              {t.tryAgain}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => onNavigate('recover-password')}>
              {t.recoverPassword}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
