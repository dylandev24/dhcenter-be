# DHCENTER Backend API

Headless CMS REST API cho nền tảng bất động sản DHCENTER.

## Kiến trúc

```
Next.js (Frontend)  →  REST API  →  NestJS Backend
                                        ↓
                                   Prisma ORM
                                        ↓
                                   PostgreSQL
                                        ↓
                                      Redis
                                        ↓
                                  Cloudinary
```

## Yêu cầu

- Node.js 20+
- PostgreSQL (Docker **hoặc** database cloud miễn phí — xem bên dưới)
- Redis, Cloudinary: **không bắt buộc** khi dev local

## Khởi chạy nhanh (có Docker)

```bash
npm install
cp .env.example .env
docker compose up -d
npm run db:setup
npm run start:dev
```

## Khởi chạy không Docker (khuyên dùng khi hết dung lượng ổ đĩa)

Chỉ cần **Node.js + PostgreSQL trên cloud** (không cài gì thêm trên máy).

### Bước 1: Tạo database miễn phí

Chọn một trong các dịch vụ (free tier):

| Dịch vụ | Link |
|---------|------|
| **Neon** (khuyên dùng) | https://neon.tech |
| Supabase | https://supabase.com |
| ElephantSQL | https://www.elephantsql.com |

Tạo project → copy **connection string** (dạng `postgresql://user:pass@host/db?sslmode=require`).

### Bước 2: Cấu hình `.env`

```bash
cd dhcenter-be
cp .env.example .env
```

Sửa `.env`:

```env
PORT=3001
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://...dán-connection-string-từ-Neon...
JWT_SECRET=dev-secret-any-string
ADMIN_EMAIL=admin@dhcenter.com
ADMIN_PASSWORD=admin123456
```

**Không cần** `REDIS_URL` — backend tự dùng cache RAM.  
**Không cần** Cloudinary — admin vẫn dán URL ảnh trực tiếp vào form.

### Bước 3: Tạo bảng + seed dữ liệu

```bash
npm install
npm run db:push
```

### Bước 4: Chạy API

```bash
npm run start:dev
```

API: `http://localhost:3001/api`  
Swagger: `http://localhost:3001/api/docs`

### Bước 5: Frontend

Trong `dhcenter-fe/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

```bash
cd dhcenter-fe
npm run dev
```

## Biến môi trường

| Biến | Mô tả |
|------|-------|
| `DATABASE_URL` | PostgreSQL connection string (**bắt buộc**) |
| `REDIS_URL` | Redis — tùy chọn, bỏ trống = cache RAM |
| `CLOUDINARY_*` | Cloudinary — tùy chọn, chỉ cần khi upload ảnh |
| `JWT_SECRET` | Secret cho admin auth |
| `CORS_ORIGIN` | Frontend URL (mặc định `http://localhost:3000`) |

## API Endpoints

### Public (không cần auth)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/posts` | Danh sách bài viết (filter: status, category, featured, search) |
| GET | `/api/posts/slug/:slug` | Chi tiết bài viết |
| POST | `/api/posts/:id/view` | Tăng lượt xem |
| GET | `/api/categories` | Danh mục tin tức |
| GET | `/api/banners?page=home&status=active` | Banner theo trang |
| GET | `/api/properties` | Danh sách BĐS (filter, pagination) |
| GET | `/api/properties/slug/:slug` | Chi tiết BĐS |
| GET | `/api/settings` | Cài đặt site |
| GET | `/api/team-members` | Ban lãnh đạo |
| POST | `/api/contact` | Form liên hệ |
| POST | `/api/recruitment` | Form tuyển dụng |
| POST | `/api/newsletter` | Đăng ký newsletter |
| POST | `/api/auth/login` | Đăng nhập admin |

### Admin (Bearer JWT)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST/PATCH/DELETE | `/api/posts` | CRUD bài viết |
| POST/DELETE | `/api/categories` | Quản lý danh mục |
| POST/PATCH/DELETE | `/api/banners` | CRUD banner |
| POST/PATCH/DELETE | `/api/properties` | CRUD BĐS |
| PATCH | `/api/settings` | Cập nhật cài đặt |
| POST | `/api/media/upload` | Upload ảnh Cloudinary |

## Dữ liệu seed

Dữ liệu được import từ `dhcenter-fe`:
- 6 bài viết tin tức
- 4 danh mục (+ Dự Án)
- 3 banner
- 16 bất động sản (mặt bằng, nhà đất, tòa nhà, văn phòng)
- 3 thành viên ban lãnh đạo
- Site settings (hotline, email, hero image, partners...)
- Admin user mặc định: `admin@dhcenter.com` / `admin123456`

## Tích hợp Frontend

Thêm vào `dhcenter-fe/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Response format khớp với types trong `dhcenter-fe/src/lib/cms/types.ts`.
