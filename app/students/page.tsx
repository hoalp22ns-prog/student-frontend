'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { studentApi } from '../lib/api';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  createdAt: string;
}

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
  });

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchStudents();
  }, [router]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getAll();
      setStudents(response.data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = {
        ...formData,
        age: parseInt(formData.age),
      };

      if (editingId) {
        // Update
        await studentApi.update(editingId, data);
      } else {
        // Create
        await studentApi.create(data);
      }

      // Reset form and refetch
      setFormData({ name: '', email: '', phone: '', age: '' });
      setShowForm(false);
      setEditingId(null);
      await fetchStudents();
    } catch (err: any) {
      setError(err.message || 'Failed to save student');
    }
  };

  const handleEdit = (student: Student) => {
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      age: student.age.toString(),
    });
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn chắc chắn muốn xóa sinh viên này?')) {
      return;
    }

    try {
      await studentApi.delete(id);
      await fetchStudents();
    } catch (err: any) {
      setError(err.message || 'Failed to delete student');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', age: '' });
  };

  if (loading && students.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <p className="text-xl text-slate-300">⏳ Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">👥 Quản Lý Sinh Viên</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) handleCancel();
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:shadow-xl hover:shadow-blue-500/30 transition font-semibold"
            >
              {showForm ? '✕ Hủy' : '➕ Thêm Sinh Viên'}
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-4">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-2xl p-8 mb-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingId ? '✏️ Sửa Sinh Viên' : '📝 Thêm Sinh Viên Mới'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Họ Tên *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Nhập họ tên sinh viên"
                      required
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="student@example.com"
                      required
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Số Điện Thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="0123456789"
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Tuổi *</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleFormChange}
                      placeholder="Nhập tuổi"
                      required
                      min="1"
                      max="120"
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg hover:shadow-xl hover:shadow-green-500/30 transition font-semibold"
                  >
                    {editingId ? '💾 Cập Nhật' : '➕ Thêm Mới'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-slate-700/50 text-slate-300 px-6 py-2 rounded-lg border border-slate-600 hover:bg-slate-700/80 transition font-semibold"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Student List */}
          <div className="bg-slate-900/60 border border-slate-700/40 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
            {students.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                Không có sinh viên. Tạo một sinh viên mới để bắt đầu! 📚
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  
                  {/* Header */}
                  <thead className="bg-slate-800/90 border-b border-slate-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-slate-200">
                        Tên
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-200">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-200">
                        Điện Thoại
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-200">
                        Tuổi
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-200">
                        Thao Tác
                      </th>
                    </tr>
                  </thead>

                  {/* Body */}
                  <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={student.id}
                      className={`
                        border-b border-slate-300/40
                        transition-all duration-200
                        hover:bg-indigo-100/60
                        ${index % 2 === 0 ? "bg-white/90" : "bg-slate-100/90"}
                      `}
                    >
                      <td className="px-6 py-4 text-slate-900 font-medium">
                        {student.name}
                      </td>

                      <td className="px-6 py-4 text-slate-800">
                        {student.email}
                      </td>

                      <td className="px-6 py-4 text-slate-800">
                        {student.phone || "—"}
                      </td>

                      <td className="px-6 py-4 text-slate-800">
                        {student.age}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(student)}
                            className="
                              px-4 py-2 rounded-xl
                              bg-indigo-500 hover:bg-indigo-600
                              text-white text-sm font-medium
                              transition-all duration-200
                            "
                          >
                            ✏️ Sửa
                          </button>

                          <button
                            onClick={() => handleDelete(student.id)}
                            className="
                              px-4 py-2 rounded-xl
                              bg-rose-500 hover:bg-rose-600
                              text-white text-sm font-medium
                              transition-all duration-200
                            "
                          >
                            🗑️ Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
