'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../lib/api';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login(username, password);
      const { token, username: returnedUsername } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('username', returnedUsername);

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
              🔐
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Đăng Nhập</h1>
            <p className="text-slate-400">Đăng nhập để tiếp tục</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-slate-300 font-medium mb-2 text-sm">
                Tên Đăng Nhập
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-slate-300 font-medium mb-2 text-sm">
                Mật Khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? '⏳ Đang xử lý...' : '🔐 Đăng Nhập'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 pt-6 border-t border-slate-700/50 text-center">
            <p className="text-slate-400 text-sm">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition">
                Đăng ký tại đây
              </Link>
            </p>
          </div>

          {/* Test Credentials Info */}
          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 font-semibold text-sm mb-2">📝 Thông Tin Thử Nghiệm:</p>
            <div className="text-blue-200 text-xs space-y-1">
              <div><strong>Tên đăng nhập:</strong> testuser</div>
              <div><strong>Mật khẩu:</strong> password123</div>
            </div>
          </div>
        </div>

        {/* Footer Help */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            Quay lại <Link href="/" className="text-blue-400 hover:text-blue-300 font-semibold">trang chủ</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
