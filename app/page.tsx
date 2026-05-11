'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { studentApi } from './lib/api';

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const user = typeof window !== 'undefined' ? localStorage.getItem('username') : null;

    if (token && user) {
      setIsLoggedIn(true);
      setUsername(user);
      fetchStats();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchStats = async () => {
    try {
      const response = await studentApi.getAll();
      setStudentCount(response.data.length);
    } catch (err) {
      console.error('Failed to fetch student count');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950">
      {/* Nền động với hiệu ứng blur */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header Navigation */}
        <header className="sticky top-0 z-50 border-b border-slate-700/30 backdrop-blur-xl bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold">
                📚
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">StudentHub</h1>
                <p className="text-xs text-slate-400">Quản lý sinh viên & điểm số</p>
              </div>
            </div>
            {isLoggedIn && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-slate-300">Xin chào</p>
                  <p className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{username}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full"></div>
              </div>
            )}
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-20">
          {isLoggedIn ? (
            <div className="space-y-16">
              {/* Section Heading */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-3">📊 Bảng Điều Khiển</h2>
                <p className="text-slate-400 text-lg">Quản lý sinh viên và điểm số một cách hiệu quả</p>
              </div>

              {/* Dashboard Stats - 3 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 - Sinh viên */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-25 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 hover:border-blue-500/50 rounded-2xl p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">👥 Tổng Sinh Viên</p>
                        <p className="text-5xl font-bold text-blue-400">{studentCount}</p>
                      </div>
                      <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">
                        📚
                      </div>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-1/3"></div>
                  </div>
                </div>

                {/* Card 2 - Điểm số */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-25 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 hover:border-purple-500/50 rounded-2xl p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">📊 Điểm Số Theo Dõi</p>
                        <p className="text-5xl font-bold text-purple-400">3</p>
                      </div>
                      <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">
                        📈
                      </div>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-1/3"></div>
                  </div>
                </div>

                {/* Card 3 - Trạng thái */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-25 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 hover:border-green-500/50 rounded-2xl p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">✅ Trạng Thái Hệ Thống</p>
                        <p className="text-5xl font-bold text-green-400">Online</p>
                      </div>
                      <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl">
                        🟢
                      </div>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-1/3"></div>
                  </div>
                </div>
              </div>
              {/* Action Buttons - Hành động chính */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                <Link
                  href="/students"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-2 group-hover:scale-105">
                    <div className="flex items-center gap-6">
                      <div className="text-6xl group-hover:scale-125 transition-transform duration-300">👥</div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Quản Lý Sinh Viên</h3>
                        <p className="text-blue-100">Thêm, chỉnh sửa và quản lý hồ sơ sinh viên</p>
                      </div>
                    </div>
                    <div className="mt-6 h-1 w-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                </Link>

                <Link
                  href="/grades"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-2xl p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:-translate-y-2 group-hover:scale-105">
                    <div className="flex items-center gap-6">
                      <div className="text-6xl group-hover:scale-125 transition-transform duration-300">📊</div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Quản Lý Điểm Số</h3>
                        <p className="text-purple-100">Theo dõi và tính toán điểm số sinh viên</p>
                      </div>
                    </div>
                    <div className="mt-6 h-1 w-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                </Link>
              </div>

              {/* Logout Button */}
              <div className="flex justify-center pt-8 border-t border-slate-700/50 mt-16">
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    setIsLoggedIn(false);
                    router.push('/');
                  }}
                  className="px-8 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30 hover:border-red-500/80 transition-all font-medium hover:-translate-y-1"
                >
                  🚪 Đăng Xuất
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
              {/* Left side - Giới thiệu */}
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="inline-block">
                    <span className="px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-semibold">
                      ✨ Chào mừng bạn
                    </span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                    Quản Lý Sinh Viên <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Thông Minh</span>
                  </h2>
                  <p className="text-xl text-slate-400 leading-relaxed">
                    Nền tảng hiện đại, an toàn để quản lý hồ sơ sinh viên và điểm số. Đăng nhập hoặc tạo tài khoản ngay!
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Tính Năng Chính</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start group">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/40 transition-colors">
                        <span className="text-xl">👥</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Quản Lý Sinh Viên</h4>
                        <p className="text-slate-400 text-sm">Thêm, xem, sửa và xóa hồ sơ sinh viên một cách dễ dàng</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start group">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/40 transition-colors">
                        <span className="text-xl">📊</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Theo Dõi Điểm Số</h4>
                        <p className="text-slate-400 text-sm">Quản lý điểm Toán, Văn, Anh và tính tổng tự động</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start group">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/40 transition-colors">
                        <span className="text-xl">🔐</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">Bảo Mật Cao</h4>
                        <p className="text-slate-400 text-sm">Xác thực JWT đảm bảo chỉ người được phép truy cập dữ liệu</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Auth Buttons */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <Link
                    href="/login"
                    className="block group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all text-center group-hover:-translate-y-2 group-hover:scale-105">
                      🔐 Đăng Nhập
                    </div>
                  </Link>

                  <Link
                    href="/register"
                    className="block group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-br from-slate-700 to-slate-800 text-white py-4 rounded-2xl font-semibold border border-slate-600 hover:border-slate-500 hover:shadow-2xl hover:shadow-slate-500/30 transition-all text-center group-hover:-translate-y-2 group-hover:scale-105">
                      ✍️ Tạo Tài Khoản
                    </div>
                  </Link>
                </div>

                {/* Info Card */}
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
                  <p className="text-slate-300 text-center">
                    Chưa có tài khoản?{' '}
                    <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2">
                      Đăng ký ngay
                    </Link>
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-blue-400">100+</p>
                    <p className="text-xs text-slate-400 mt-1">Sinh viên</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-purple-400">99%</p>
                    <p className="text-xs text-slate-400 mt-1">Hoạt động</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-700/50 backdrop-blur-xl bg-slate-900/20 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="text-white font-semibold mb-4">StudentHub</h4>
                <p className="text-slate-400 text-sm">Nền tảng quản lý sinh viên và điểm số hiện đại, an toàn và dễ sử dụng.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Tính Năng</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-blue-400 transition">Quản Lý Sinh Viên</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition">Theo Dõi Điểm Số</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition">Xác Thực An Toàn</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Hỗ Trợ</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-blue-400 transition">Trợ Giúp</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition">Liên Hệ</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition">Điều Khoản</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-700/50 pt-8 text-center">
              <p className="text-slate-400 text-sm">
                Xây dựng với <span className="text-red-500">❤️</span> bằng Next.js + Spring Boot | © 2024 StudentHub. Bảo lưu mọi quyền.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}