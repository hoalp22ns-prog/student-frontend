'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gradeApi, studentApi } from '../lib/api';

interface Grade {
  id: number;
  studentId: number;
  math: number;
  literature: number;
  english: number;
  total: number;
  createdAt: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
}

export default function GradesPage() {
  const router = useRouter();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    studentId: '',
    math: '',
    literature: '',
    english: '',
  });

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gradesRes, studentsRes] = await Promise.all([
        gradeApi.getAll(),
        studentApi.getAll(),
      ]);
      setGrades(gradesRes.data);
      setStudents(studentsRes.data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getStudentName = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    return student?.name || 'Unknown';
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        studentId: parseInt(formData.studentId),
        math: parseFloat(formData.math),
        literature: parseFloat(formData.literature),
        english: parseFloat(formData.english),
      };

      // Validate scores
      const scores = [data.math, data.literature, data.english];
      if (scores.some(s => s < 0 || s > 10)) {
        setError('All scores must be between 0 and 10');
        return;
      }

      if (editingId) {
        // Update
        await gradeApi.update(editingId, data);
      } else {
        // Create
        await gradeApi.create(data);
      }

      // Reset form and refetch
      setFormData({ studentId: '', math: '', literature: '', english: '' });
      setShowForm(false);
      setEditingId(null);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to save grade');
    }
  };

  const handleEdit = (grade: Grade) => {
    setFormData({
      studentId: grade.studentId.toString(),
      math: grade.math.toString(),
      literature: grade.literature.toString(),
      english: grade.english.toString(),
    });
    setEditingId(grade.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this grade?')) {
      return;
    }

    try {
      await gradeApi.delete(id);
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete grade');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ studentId: '', math: '', literature: '', english: '' });
  };

  if (loading) {
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
            <h1 className="text-4xl font-bold text-white">📊 Quản Lý Điểm Số</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) handleCancel();
              }}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-lg hover:shadow-xl hover:shadow-purple-500/30 transition font-semibold"
            >
              {showForm ? '✕ Hủy' : '➕ Thêm Điểm'}
            </button>
          </div>
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
            {editingId ? '✏️ Sửa Điểm Số' : '📝 Thêm Điểm Số Mới'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-2">Chọn Sinh Viên *</label>
                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                  disabled={editingId !== null}
                >
                  <option value="">Chọn sinh viên</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id} className="bg-slate-800">
                      {student.name} ({student.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-2">Toán (0-10) *</label>
                <input
                  type="number"
                  name="math"
                  value={formData.math}
                  onChange={handleFormChange}
                  placeholder="0"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-2">Văn (0-10) *</label>
                <input
                  type="number"
                  name="literature"
                  value={formData.literature}
                  onChange={handleFormChange}
                  placeholder="0"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-2">Anh (0-10) *</label>
                <input
                  type="number"
                  name="english"
                  value={formData.english}
                  onChange={handleFormChange}
                  placeholder="0"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
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

      {/* Grades List */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
        {grades.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            Không có điểm số. Thêm một điểm mới để bắt đầu! 📚
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-white">Sinh Viên</th>
                  <th className="px-6 py-4 text-center font-semibold text-white">Toán</th>
                  <th className="px-6 py-4 text-center font-semibold text-white">Văn</th>
                  <th className="px-6 py-4 text-center font-semibold text-white">Anh</th>
                  <th className="px-6 py-4 text-center font-semibold text-white">Tổng</th>
                  <th className="px-6 py-4 text-left font-semibold text-white">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => (
                  <tr key={grade.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4 font-medium text-black">{getStudentName(grade.studentId)}</td>
                    <td className="px-6 py-4 text-center text-black bg-blue-500/20">{grade.math}</td>
                    <td className="px-6 py-4 text-center text-black bg-green-500/20">{grade.literature}</td>
                    <td className="px-6 py-4 text-center text-black bg-amber-500/20">{grade.english}</td>
                    <td className="px-6 py-4 text-center font-bold text-lg text-black bg-purple-500/30">
                      {grade.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(grade)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(grade.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                      >
                        🗑️ Delete
                      </button>
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
  ); }
