# 🎓 Student Frontend - Next.js Application

Ứng dụng web **quản lý sinh viên** được xây dựng bằng **Next.js 16** + **React 19** + **TypeScript**. Cung cấp giao diện responsive hiện đại tích hợp chặt chẽ với Spring Boot backend thông qua REST API.

---

## 📋 Mục Đích & Công Dụng Chi Tiết

### 🎯 Chức Năng Chính
Ứng dụng này phục vụ như một **Frontend Portal** để quản lý dữ liệu sinh viên:

- **✅ Khái quát Dữ Liệu**: Hiển thị danh sách toàn bộ sinh viên từ backend database
- **✅ Thêm Mới (Create)**: Form nhập liệu đầy đủ để thêm sinh viên với validation
  - Trường: Tên, Email (unique), Số điện thoại, Tuổi
  - Validation: Kiểm tra format email, độ dài dữ liệu
  - Xử lý lỗi: Thông báo rõ ràng nếu thêm thất bại
  
- **✅ Cập Nhật (Update)**: Chỉnh sửa thông tin sinh viên hiện có
  - Tải dữ liệu hiện tại vào form
  - Cho phép sửa tất cả các trường
  - Gửi request PUT tới backend

- **✅ Xóa (Delete)**: Xóa sinh viên khỏi database với xác nhận
  - Hiển thị dialog xác nhận trước khi xóa
  - Ghi log thao tác
  - Cập nhật danh sách ngay lập tức

- **✅ Search & Filter**: Tìm kiếm sinh viên theo:
  - Tên đầy đủ
  - Email
  - Hỗ trợ search real-time (filter local hoặc query từ backend)

- **✅ Giao Diện Responsive**: 100% tương thích
  - Desktop: Layout bảng đầy đủ
  - Tablet: Bố cục co giãn, dễ tap
  - Mobile: Card view, single column, touch-friendly

- **✅ State Management & Error Handling**:
  - Loading indicators khi fetch dữ liệu
  - Error toasts/alerts cho thao tác thất bại
  - Retry logic nếu API timeout
  - User feedback rõ ràng cho mỗi thao tác

- **✅ Kết Nối Dual-Database Backend**: 
  - Tích hợp API endpoints từ Spring Boot
  - Hỗ trợ failover nếu primary DB down
  - Retry mechanism cho requests

### 🔄 Workflow Dữ Liệu

```
Frontend (Next.js) 
    ↓
API Client (Axios) 
    ↓
Backend Spring Boot (REST endpoints) 
    ↓
Database (Render PostgreSQL + Railway backup)
```

---

## 🛠️ Stack Công Nghệ

| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|----------|---------|
| **Next.js** | 16.1.6 | React framework với App Router (SSR, SSG, API routes) |
| **React** | 19.2.3 | UI library, component-based architecture |
| **TypeScript** | 5 | Type safety, IDE intellisense support |
| **Tailwind CSS** | 4 | Utility-first CSS framework, responsive design |
| **Axios** | 1.13.6 | HTTP client cho API calls |
| **Vercel Deployment** | - | Production hosting |

---

## 📂 Cấu Trúc File & Công Dụng Chi Tiết

```
student-frontend/
│
├── 📄 app/
│   ├── 📄 page.tsx                    ⭐ Trang chính quản lý sinh viên
│   │                                   - Component chính (Client-side)
│   │                                   - State: students[], form data
│   │                                   - CRUD operations UI
│   │                                   - Form thêm/sửa với validation
│   │                                   - DataTable hiển thị danh sách
│   │                                   - Action buttons (Edit, Delete)
│   │
│   ├── 📄 layout.tsx                   # Root layout wrapper
│   │                                   - Metadata, title, favicon
│   │                                   - Provider wrappers nếu cần
│   │                                   - Global styling setup
│   │
│   ├── 📄 globals.css                  # Global CSS styles
│   │                                   - Tailwind @layer directives
│   │                                   - Base styles cho HTML, body
│   │                                   - Custom utility classes
│   │                                   - Animation definitions
│   │
│   ├── 📁 lib/
│   │   └── 📄 api.js                   ⭐ API Client Configuration
│   │                                   - Axios instance setup
│   │                                   - Base URL: https://...render.com
│   │                                   - Error interceptors
│   │                                   - API methods:
│   │                                     • getAll() → GET /api/students
│   │                                     • create(data) → POST /api/students
│   │                                     • update(id, data) → PUT /api/students/{id}
│   │                                     • delete(id) → DELETE /api/students/{id}
│   │
│   └── 📄 favicon.ico                  # Browser tab icon
│
├── 📁 public/                           # Static assets (images, fonts, etc)
│
├── 📄 Dockerfile                        # Container configuration
│   │                                   - Multi-stage build (builder → runner)
│   │                                   - Base image: node:18-alpine
│   │                                   - Build output: .next
│   │                                   - Port: 3000 (standalone mode)
│   │
├── 📄 package.json                      # Project metadata & dependencies
│   │                                   - Scripts: dev, build, start, lint
│   │                                   - Prod deps: next, react, axios, tailwindcss
│   │                                   - Dev deps: typescript, eslint, types
│   │
├── 📄 next.config.ts                    # Next.js configuration
│   │                                   - Output: standalone (Docker-optimized)
│   │                                   - Image optimization settings
│   │
├── 📄 tsconfig.json                     # TypeScript compiler options
│   │                                   - Target, lib, strict mode
│   │                                   - Aliases
│   │
├── 📄 .env.local                        # Environment variables (⚠️ .gitignore)
│   │                                   - NEXT_PUBLIC_API_URL=https://...
│   │
├── 📄 .gitignore                        # Git ignore patterns
│   │                                   - node_modules, .next, dist, .env
│   │
├── 📄 eslint.config.mjs                 # ESLint configuration
│
└── 📄 README.md                         # Documentation (file này)
```

### 🔑 File Quan Trọng Nhất:
1. **`app/page.tsx`** - Tất cả UI logic ở đây
2. **`app/lib/api.js`** - Kết nối backend, update base URL nếu deploy
3. **`package.json`** - Dependencies management
4. **`.env.local`** - Environment variables cho local development

---

## 🚀 Chạy Backend Trên Local

### 📋 Yêu Cầu
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- Backend Spring Boot đã chạy trên `http://localhost:8080`

### ⚙️ Setup & Installation

#### 1. **Clone hoặc Download Project**
```bash
cd student-frontend
```

#### 2. **Cài Đặt Dependencies**
```bash
npm install
```

#### 3. **Cấu Hình Environment Variables**

Tạo file `.env.local` ở thư mục gốc:
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Ghi chú:**
- Biến phải bắt đầu `NEXT_PUBLIC_` để client-side có thể access
- Local development: `http://localhost:8080`
- Production cloud: `https://student-backend-xxxxx.onrender.com`

#### 4. **Chạy Development Server**
```bash
npm run dev
```

**Output:**
```
> student-frontend@0.1.0 dev
> next dev

  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
  - Environments: .env.local

Ready in 2.45s
```

Mở browser: **[http://localhost:3000](http://localhost:3000)**

#### 5. **Build cho Production**
```bash
# Compile project
npm run build

# Tạo .next folder (optimized output)
# Output: .next/ + public/
```

#### 6. **Chạy Production Build Locally**
```bash
npm start
```
Sẽ chạy trên port 3000 (production mode, tốc độ nhanh hơn dev mode)

---

## 📤 Upload GitHub & Deploy Trên Cloud

### 1️⃣ **Khởi Tạo Git Repository**

Nếu chưa có:
```bash
cd student-frontend
git init
git add .
git commit -m "init: Student Frontend with Next.js"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/student-frontend.git
git push -u origin main
```

### 2️⃣ **Cấu Hình GitHub Repository**

1. Vào **GitHub** → Tạo private/public repo
2. Push code lên (như trên)
3. Đảm bảo `.env.local` **KHÔNG** trong `.gitignore` (private keys không commit)

### 3️⃣ **Deploy Lên Cloud**

#### 🔵 Option A: Deploy Trên **Vercel** (Recommended)

**Ưu điểm:**
- Next.js native support (made by Vercel team)
- Auto-deploy khi push GitHub
- Serverless functions
- Free tier

**Các Bước:**

1. **Đăng ký Vercel**:
   - Vào [vercel.com](https://vercel.com)
   - Đăng ký với GitHub account

2. **Import Project**:
   - Dashboard → **Add New Project** → **Import Git Repository**
   - Chọn `student-frontend` repo

3. **Cấu Hình Environment**:
   - Project Settings → Environment Variables
   - Thêm:
     ```
     NEXT_PUBLIC_API_URL = https://student-backend-xxxxx.onrender.com
     ```

4. **Deploy**:
   - Nhấn **Deploy**
   - Chờ build (~2-3 phút)
   - Nhận URL: `https://student-frontend-xxxxx.vercel.app`

5. **Auto-Deploy** (Continuous Deployment):
   - Mỗi khi push commit lên `main` branch
   - Vercel tự động build + deploy

**Link Production:**
```
https://student-frontend-xxxxx.vercel.app
```

---

#### 🔴 Option B: Deploy Trên **Render**

**Ưu điểm:**
- Miễn phí tier
- Chạy cùng server với backend (nếu backend cũng trên Render)
- Đơn giản, giống AWS

**Các Bước:**

1. **Tạo Web Service**:
   - [render.com](https://render.com) → **New** → **Web Service**
   - Chọn GitHub repo

2. **Build & Start Commands**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Environment Variables**:
   - Add `NEXT_PUBLIC_API_URL = https://student-backend-xxxxx.onrender.com`

4. **Deploy**: Render tự động build & push live

**Link Production:**
```
https://student-frontend-xxxxx.onrender.com
```

---

#### 🟢 Option C: Deploy Docker Container

**Dockerfile đã chuẩn bị:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

**Các Bước Deploy:**

1. **Build Docker Image**:
   ```bash
   docker build -t student-frontend:latest .
   ```

2. **Push Docker Hub**:
   ```bash
   docker tag student-frontend:latest YOUR_DOCKER_USERNAME/student-frontend:latest
   docker push YOUR_DOCKER_USERNAME/student-frontend:latest
   ```

3. **Deploy trên Render/Railway/DigitalOcean**:
   - Chọn private registry: Docker Hub
   - Image: `YOUR_DOCKER_USERNAME/student-frontend:latest`
   - Port: 3000

---

### 4️⃣ **Cập Nhật API URL Sau Deploy**

Sau khi backend deploy successful, cập nhật `.env.local` hoặc environment variables:

```bash
# Before deployment (local):
NEXT_PUBLIC_API_URL=http://localhost:8080

# After deployment (Vercel/Render):
NEXT_PUBLIC_API_URL=https://student-backend-nf1o.onrender.com
```

**Cập nhật Vercel:**
1. Vercel Dashboard → Project Settings
2. Environment Variables
3. Update `NEXT_PUBLIC_API_URL`
4. Redeploy: Deployments → select latest → **Redeploy**

---

### 5️⃣ **Verify Deployment**

```bash
# Test API connectivity
curl https://YOUR_FRONTEND_URL/api/students
# hoặc mở browser DevTools → Network tab
# Kiểm tra CORS requests tới backend
```

---

## 🔗 API Integration Reference

### Endpoints Called:
```typescript
// src/app/lib/api.js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

GET    /api/students                    // Lấy danh sách
POST   /api/students                    // Thêm mới
PUT    /api/students/{id}               // Cập nhật
DELETE /api/students/{id}               // Xóa

GET    /api/students/health/detailed    // Health check (optional)
GET    /api/students/admin/consistency-check // DB sync (optional)
```

### Data Model:
```typescript
interface Student {
  id: number;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  created_at?: string;
}
```

---

## 🐛 Troubleshooting

### Frontend không kết nối backend?
```bash
# 1. Kiểm tra .env.local
cat .env.local

# 2. Kiểm tra backend chạy
curl http://localhost:8080/api/students

# 3. Browser DevTools → Network tab
# Xem request URL & response status

# 4. Kiểm tra CORS headers
# Backend phải enable CORS cho http://localhost:3000
```

### Build failed?
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Port 3000 occupied?
```bash
# Kill process
# Windows: 
taskkill /PID <PID> /F
# Or specify different port
npm run dev -- -p 3001
```

---

## 📚 Tài Liệu

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Axios](https://axios-http.com/docs/intro)

---

## ✅ Checklist Before Production

- [ ] Backend endpoint URL correct
- [ ] Environment variables configured
- [ ] API health check passing
- [ ] Search/filter functionality tested
- [ ] Form validation working
- [ ] Mobile responsive tested
- [ ] Error handling user-friendly
- [ ] Deployment script ready
- [ ] GitHub repo updated
- [ ] Cloud deployment successful

1. **CORS Errors**: 
   - Đảm bảo backend cho phép CORS từ domain frontend
   - Cấu hình backend: `@CrossOrigin` hoặc global CORS config

2. **API Not Found**:
   - Kiểm tra `NEXT_PUBLIC_API_URL` trong `.env.local`
   - Đảm bảo backend đang chạy

3. **Build Errors**:
   - Xóa `.next` folder và build lại
   - Kiểm tra TypeScript errors

## 🧪 Testing

### Chạy Tests

```bash
npm test
```

### Manual Testing Checklist

- [ ] Xem danh sách sinh viên
- [ ] Thêm sinh viên mới
- [ ] Sửa thông tin sinh viên
- [ ] Xóa sinh viên
- [ ] Responsive trên mobile
- [ ] Xử lý lỗi khi API down

## 📊 Performance Optimization

- **Image Optimization**: Sử dụng Next.js Image component
- **Code Splitting**: Tự động với Next.js
- **Static Generation**: Cho các trang tĩnh
- **API Caching**: Có thể thêm React Query/SWR

## 🔄 CI/CD

### GitHub Actions Workflow

Tạo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

MIT License

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://react.dev/)

---

**Developed with ❤️ using Next.js & React**