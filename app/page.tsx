'use client';
import { useEffect, useState } from 'react';
import { studentApi } from './lib/api';

// Khai báo kiểu dữ liệu Student
interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  age: string;
}

interface HealthStatus {
  primaryDbStatus?: string;
  secondaryDbStatus?: string;
  syncStatus?: string;
  primaryRecordCount?: number;
  secondaryRecordCount?: number;
  lastSyncTime?: string;
  status?: string;
}

interface AppError {
  message: string;
  status?: number;
  timestamp: number;
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [form, setForm] = useState<FormData>({ 
    name: '', email: '', phone: '', age: '' 
  });
  
  // 🆕 Error & Health Status States
  const [error, setError] = useState<AppError | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCheckingConsistency, setIsCheckingConsistency] = useState(false);

  useEffect(() => { 
    loadStudents();
    checkHealth();
  }, []);

  const loadStudents = async () => {
    try {
      setError(null);
      const res = await studentApi.getAll();
      setStudents(res.data);
    } catch (err: any) {
      const errorMsg = err.message;
      setError({
        message: `❌ Không thể tải danh sách sinh viên: ${errorMsg}`,
        status: err.status,
        timestamp: Date.now(),
      });
      console.error('Error loading students:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 Check Health Status (Render + Railway)
  const checkHealth = async () => {
    try {
      setIsCheckingHealth(true);
      const res = await studentApi.healthDetailed();
      setHealthStatus(res.data);
      setError(null);
    } catch (err: any) {
      const errorMsg = err.message;
      setError({
        message: `⚠️ Không thể kết nối backend: ${errorMsg}`,
        status: err.status,
        timestamp: Date.now(),
      });
      console.error('Health check failed:', err);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  // 🆕 Trigger Manual Sync
  const triggerSync = async () => {
    if (!confirm('Bạn có chắc muốn đồng bộ dữ liệu Render → Railway?')) return;
    try {
      setIsSyncing(true);
      await studentApi.manualSync();
      setError(null);
      alert('✅ Đã bắt đầu đồng bộ dữ liệu!');
      setTimeout(() => checkHealth(), 2000);
    } catch (err: any) {
      const errorMsg = err.message;
      setError({
        message: `❌ Lỗi đồng bộ: ${errorMsg}`,
        status: err.status,
        timestamp: Date.now(),
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // 🆕 Check Consistency
  const checkConsistency = async () => {
    try {
      setIsCheckingConsistency(true);
      const res = await studentApi.consistencyCheck();
      const result = res.data;
      if (result.syncStatus === 'SYNCHRONIZED') {
        alert('✅ Dữ liệu Render & Railway đã đồng bộ!');
      } else {
        alert(`⚠️ Dữ liệu không đồng bộ:\nRender: ${result.primaryRecordCount}\nRailway: ${result.secondaryRecordCount}`);
      }
      setError(null);
    } catch (err: any) {
      const errorMsg = err.message;
      setError({
        message: `❌ Lỗi kiểm tra: ${errorMsg}`,
        status: err.status,
        timestamp: Date.now(),
      });
    } finally {
      setIsCheckingConsistency(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      alert('Vui lòng nhập họ tên và email!');
      return;
    }
    try {
      setError(null);
      if (editStudent) {
        await studentApi.update(editStudent.id, form);
      } else {
        await studentApi.create(form);
      }
      setForm({ name: '', email: '', phone: '', age: '' });
      setShowForm(false);
      setEditStudent(null);
      loadStudents();
    } catch (err: any) {
      const errorMsg = err.message;
      setError({
        message: `❌ Lỗi lưu dữ liệu: ${errorMsg}`,
        status: err.status,
        timestamp: Date.now(),
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa?')) return;
    try {
      setError(null);
      await studentApi.delete(id);
      loadStudents();
    } catch (err: any) {
      const errorMsg = err.message;
      setError({
        message: `❌ Lỗi xóa dữ liệu: ${errorMsg}`,
        status: err.status,
        timestamp: Date.now(),
      });
    }
  };

  const handleEdit = (student: Student) => {
    setEditStudent(student);
    setForm({ 
      name: student.name, 
      email: student.email,
      phone: student.phone, 
      age: String(student.age) 
    });
    setShowForm(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">

        {/* 🆕 Error Notification - Shows detailed error messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <div className="font-semibold">{error.message}</div>
            {error.status && <div className="text-sm text-red-600 mt-1">Status: {error.status}</div>}
            <button
              onClick={() => setError(null)}
              className="text-sm text-red-600 underline mt-2 hover:text-red-800"
            >
              Đóng thông báo
            </button>
          </div>
        )}

        {/* 🆕 Health Status Section - Shows Render + Railway status */}
        <div className="mb-6 p-4 bg-white rounded-xl shadow border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              🔧 Trạng Thái Backend & Databases
            </h2>
            <button
              onClick={checkHealth}
              disabled={isCheckingHealth}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
            >
              {isCheckingHealth ? 'Đang kiểm tra...' : '🔄 Kiểm Tra'}
            </button>
          </div>

          {healthStatus ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <div className="text-xs text-gray-500">Render (Primary)</div>
                <div className={`font-semibold ${healthStatus.primaryDbStatus === 'UP' ? 'text-green-600' : 'text-red-600'}`}>
                  {healthStatus.primaryDbStatus === 'UP' ? '✅ OK' : '❌ DOWN'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Railway (Secondary)</div>
                <div className={`font-semibold ${healthStatus.secondaryDbStatus === 'UP' ? 'text-green-600' : 'text-red-600'}`}>
                  {healthStatus.secondaryDbStatus === 'UP' ? '✅ OK' : '❌ DOWN'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Sync Status</div>
                <div className={`font-semibold ${healthStatus.syncStatus === 'SYNCHRONIZED' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {healthStatus.syncStatus === 'SYNCHRONIZED' ? '✅ OK' : '⚠️ PENDING'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Records</div>
                <div className="font-semibold text-gray-700">
                  {healthStatus.primaryRecordCount} / {healthStatus.secondaryRecordCount}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">
              Chưa kiểm tra health. Bấm nút "Kiểm Tra" để xem trạng thái.
            </div>
          )}

          {/* 🆕 Admin Actions */}
          <div className="flex gap-2 mt-4 border-t pt-4">
            <button
              onClick={triggerSync}
              disabled={isSyncing}
              className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 disabled:opacity-50"
            >
              {isSyncing ? '⏳ Đồng bộ...' : '🔄 Đồng Bộ (Render→Railway)'}
            </button>
            <button
              onClick={checkConsistency}
              disabled={isCheckingConsistency}
              className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 disabled:opacity-50"
            >
              {isCheckingConsistency ? '⏳ Kiểm tra...' : '✓ Kiểm Tra Consistency'}
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              Quản Lý Sinh Viên
            </h1>
            <p className="text-gray-500 mt-1">
              Tổng số: {students.length} sinh viên
            </p>
          </div>
          <button
            onClick={() => { 
              setShowForm(true); 
              setEditStudent(null);
              setForm({ name: '', email: '', phone: '', age: '' }); 
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            + Thêm Sinh Viên
          </button>
        </div>

        {/* Form Thêm/Sửa */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              {editStudent ? 'Sửa Sinh Viên' : 'Thêm Sinh Viên Mới'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Họ Tên *</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email *</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="a@gmail.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Số Điện Thoại</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="0901234567"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Tuổi</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="20"
                  type="number"
                  value={form.age}
                  onChange={e => setForm({ ...form, age: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {editStudent ? 'Cập Nhật' : 'Thêm Mới'}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditStudent(null); }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Bảng Danh Sách */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-400">
              Đang tải dữ liệu...
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              Chưa có sinh viên nào. Bấm "+ Thêm Sinh Viên" để bắt đầu!
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Họ Tên</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Điện Thoại</th>
                  <th className="px-4 py-3 text-left">Tuổi</th>
                  <th className="px-4 py-3 text-left">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-gray-500">{s.id}</td>
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600">{s.email}</td>
                    <td className="px-4 py-3 text-gray-600">{s.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{s.age}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEdit(s)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-500 text-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </main>
  );
}