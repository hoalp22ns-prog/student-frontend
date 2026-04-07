'use client';
import { useEffect, useState } from 'react';
import { studentApi } from './lib/api';
import styles from './page.module.css';

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
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => { 
    loadStudents();
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
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>👨‍🎓 Quản Lý Sinh Viên</h1>
        <p>Hệ thống quản lý dữ liệu sinh viên tích hợp với Spring Boot Backend</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className={styles.error}>
          <strong>⚠️ {error.message}</strong>
          {error.status && <div style={{ marginTop: '8px', fontSize: '12px' }}>HTTP Status: {error.status}</div>}
          <button 
            onClick={() => setError(null)}
            style={{ marginTop: '8px', padding: '4px 12px', background: '#c82333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
          >
            Đóng
          </button>
        </div>
      )}

      {/* Add Student Button */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#333', margin: '0 0 5px 0' }}>
            📋 Danh Sách Sinh Viên
          </h2>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            Tổng: <strong>{students.length}</strong> sinh viên
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditStudent(null);
            setForm({ name: '', email: '', phone: '', age: '' });
          }}
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          ➕ Thêm Sinh Viên
        </button>
      </div>

      {/* Form Add/Edit */}
      {showForm && (
        <div className={styles.formSection}>
          <h2>{editStudent ? '✏️ Sửa Sinh Viên' : '➕ Thêm Sinh Viên Mới'}</h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Họ Tên *</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email *</label>
              <input
                type="email"
                placeholder="nguyen@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Số Điện Thoại</label>
              <input
                type="tel"
                placeholder="0901234567"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tuổi</label>
              <input
                type="number"
                placeholder="20"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button
              onClick={() => {
                setShowForm(false);
                setEditStudent(null);
                setForm({ name: '', email: '', phone: '', age: '' });
              }}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className={`${styles.button} ${styles.buttonPrimary}`}
            >
              {editStudent ? 'Cập Nhật' : 'Thêm Mới'}
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      {students.length > 0 && (
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo tên hoặc email..."
            className={styles.searchInput}
          />
        </div>
      )}

      {/* Student Table */}
      {loading ? (
        <div className={styles.loading}>
          <span className={styles.spinner}></span>
          Đang tải dữ liệu...
        </div>
      ) : students.length === 0 ? (
        <div className={styles.empty}>
          📭 Chưa có sinh viên. Bấm "➕ Thêm Sinh Viên" để bắt đầu!
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ Tên</th>
                <th>Email</th>
                <th>Điện Thoại</th>
                <th>Tuổi</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>#{student.id}</td>
                  <td><strong>{student.name}</strong></td>
                  <td>{student.email}</td>
                  <td>{student.phone || '-'}</td>
                  <td>{student.age || '-'}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => handleEdit(student)}
                        className={`${styles.button} ${styles.buttonSuccess} ${styles.buttonSmall}`}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className={`${styles.button} ${styles.buttonDanger} ${styles.buttonSmall}`}
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
  );
}