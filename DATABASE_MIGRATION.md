# 📘 Hướng Dẫn Migration Database Supabase

## 🎯 Mục đích
Chuyển cấu trúc database từ Supabase cũ sang Supabase mới (KHÔNG bao gồm dữ liệu)

## 📋 Các bước thực hiện

### Bước 1: Chuẩn bị
1. ✅ Đã tạo project Supabase mới
2. ✅ Đã cập nhật file `.env` với thông tin database mới
3. ✅ File `supabase_schema.sql` đã sẵn sàng

### Bước 2: Chạy Migration Script

#### Phương án A: Qua Supabase Dashboard (Khuyến nghị)
1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project mới của bạn
3. Vào **SQL Editor** (icon Database → SQL Editor)
4. Tạo một query mới
5. Copy toàn bộ nội dung file `supabase_schema.sql`
6. Paste vào SQL Editor
7. Click **Run** hoặc nhấn `Ctrl + Enter`
8. Đợi script chạy xong (khoảng 10-30 giây)

#### Phương án B: Qua Supabase CLI (Nếu đã cài đặt)
```bash
# Đăng nhập
supabase login

# Link với project
supabase link --project-ref <YOUR_PROJECT_REF>

# Chạy migration
supabase db push --file supabase_schema.sql
```

### Bước 3: Kiểm tra Migration

Sau khi chạy script, kiểm tra trong Supabase Dashboard:

#### 3.1. Kiểm tra Tables
Vào **Database → Tables**, bạn phải thấy 5 bảng:
- ✅ `profile` - Thông tin cá nhân
- ✅ `projects` - Dự án
- ✅ `skills` - Kỹ năng
- ✅ `education` - Học vấn
- ✅ `experience` - Kinh nghiệm làm việc

#### 3.2. Kiểm tra RLS Policies
Vào từng bảng → Tab **Policies**, mỗi bảng phải có 4 policies:
- ✅ Anyone can view (SELECT)
- ✅ Users can insert their own (INSERT)
- ✅ Users can update their own (UPDATE)
- ✅ Users can delete their own (DELETE)

#### 3.3. Kiểm tra Storage Buckets
Vào **Storage**, bạn phải thấy 2 buckets:
- ✅ `avatars` - Lưu ảnh đại diện
- ✅ `project-images` - Lưu ảnh dự án

### Bước 4: Test Connection

Chạy website để test kết nối:

```bash
npm run dev
```

1. Mở http://localhost:3000
2. Trang chủ sẽ hiển thị (có thể trống nếu chưa có dữ liệu)
3. Vào http://localhost:3000/auth để đăng ký/đăng nhập
4. Vào http://localhost:3000/admin để thêm dữ liệu

### Bước 5: Thêm Dữ liệu Mẫu (Tùy chọn)

Nếu muốn có dữ liệu để test, vào Admin Dashboard và thêm:
1. **Profile**: Tên, title, bio, avatar
2. **Projects**: Tối thiểu 1-2 dự án
3. **Skills**: Một vài kỹ năng với level
4. **Education**: Thông tin học vấn
5. **Experience**: Kinh nghiệm làm việc

---

## 🔧 Cấu trúc Database

### 📊 Schema Overview
```
profile (1)              ← Thông tin cá nhân của user
  ├── id (UUID)
  ├── user_id (UUID FK)  ← Liên kết với auth.users
  ├── full_name
  ├── title
  ├── bio
  └── social links...

projects (1..*)          ← Danh sách dự án
  ├── id (UUID)
  ├── user_id (UUID FK)
  ├── title
  ├── description
  ├── technologies (TEXT[])
  └── display_order

skills (1..*)            ← Kỹ năng
  ├── id (UUID)
  ├── user_id (UUID FK)
  ├── name
  ├── category
  ├── level (0-100)
  └── display_order

education (1..*)         ← Học vấn
  ├── id (UUID)
  ├── user_id (UUID FK)
  ├── institution
  ├── degree
  ├── start_date
  └── end_date

experience (1..*)        ← Kinh nghiệm
  ├── id (UUID)
  ├── user_id (UUID FK)
  ├── company
  ├── position
  ├── start_date
  └── end_date
```

---

## ⚠️ Troubleshooting

### Lỗi: "permission denied for schema public"
**Giải pháp**: Chạy lại script với quyền admin hoặc kiểm tra RLS policies

### Lỗi: "relation already exists"
**Giải pháp**: Bảng đã tồn tại. Nếu muốn tạo lại:
```sql
-- Xóa tất cả bảng cũ (CẨNN THẬN!)
DROP TABLE IF EXISTS public.experience CASCADE;
DROP TABLE IF EXISTS public.education CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.profile CASCADE;

-- Sau đó chạy lại script supabase_schema.sql
```

### Website không hiển thị dữ liệu
**Nguyên nhân**: Chưa có dữ liệu hoặc RLS policies chưa đúng
**Giải pháp**: 
1. Kiểm tra RLS policies đã enable đúng chưa
2. Thêm dữ liệu mẫu qua Admin Dashboard
3. Check browser console xem có lỗi API không

---

## ✅ Checklist Hoàn Tất

- [ ] Đã chạy `supabase_schema.sql` thành công
- [ ] 5 bảng đã được tạo trong Database
- [ ] RLS policies đã được apply cho tất cả bảng
- [ ] Storage buckets đã được tạo
- [ ] Website chạy được và kết nối database thành công
- [ ] Có thể đăng nhập/đăng ký user mới
- [ ] Có thể thêm/sửa/xóa dữ liệu qua Admin Dashboard

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. **Supabase Dashboard** → Database → Logs
2. **Browser DevTools** → Console tab
3. **Network tab** → Xem các API calls có lỗi không

---

**🎉 Chúc bạn migration thành công!**
