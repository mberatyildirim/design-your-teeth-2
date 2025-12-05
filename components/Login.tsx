// Login Component - Admin panel'e giriş için

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin?: () => void;
  onLoginSuccess?: () => void;
  onClose?: () => void;
}

const ADMIN_CREDENTIALS = {
  username: 'sahan_aslan',
  password: 'design_your_teeth123'
};

export const Login: React.FC<LoginProps> = ({ onLogin, onLoginSuccess, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simüle edilmiş loading (gerçek uygulamada API call olabilir)
    setTimeout(() => {
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Login başarılı - session'a kaydet
        sessionStorage.setItem('admin_logged_in', 'true');
        if (onLoginSuccess) {
          onLoginSuccess();
        } else if (onLogin) {
          onLogin();
        }
      } else {
        setError('Invalid username or password');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-stone-600 hover:text-stone-900"
        >
          ✕
        </button>
      )}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">Admin Login</h1>
          <p className="text-stone-500">Design Your Teeth Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary" size={20} />
            <input 
              type="text" 
              placeholder="Username" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
              autoComplete="username"
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
              autoComplete="current-password"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            fullWidth 
            size="lg" 
            disabled={isLoading}
            className="py-4 text-lg shadow-xl shadow-primary/20"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
};

