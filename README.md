# My Workout - Ứng Dụng Hỗ Trợ Tập Gym

## Giới Thiệu

**My Workout** là một ứng dụng hỗ trợ tập gym giúp người dùng lập kế hoạch tập luyện, theo dõi tiến trình, tìm kiếm bài tập, và kết nối với cộng đồng. Ứng dụng được phát triển trên nền tảng **React Native** kết hợp với **Node.js** và **MongoDB** để cung cấp trải nghiệm tập luyện thông minh và cá nhân hóa.

## Công Nghệ Sử Dụng
- **Ngôn ngữ lập trình:** JavaScript
- **Framework:** React Native (Expo), Node.js (Backend)
- **Cơ sở dữ liệu:** MongoDB
- **Thư viện hỗ trợ:** Socket.io (giao tiếp real-time)

## Chức Năng Chính
### 1. Người Dùng
- **Đăng ký / Đăng nhập** (hỗ trợ đăng nhập bằng Google, Facebook)
- **Thiết lập mục tiêu tập luyện** (tùy chỉnh kế hoạch tập luyện cá nhân)
- **Lập kế hoạch và theo dõi quá trình tập luyện**
- **Tìm kiếm bài tập** 
- **Nhắn tin và kết nối với cộng đồng** (bình luận, thích, chia sẻ bài viết)
- **Thông báo nhắc nhở tập luyện**
- **Thống kê tiến độ tập luyện**

### 2. Quản Trị Viên
- **Quản lý người dùng** 
- **Kiểm duyệt nội dung bài viết và bình luận**
- **Quản lý danh mục bài tập và lộ trình tập luyện**

### 3. Kiến Trúc Hệ Thống
- **Frontend:** React Native (giao diện người dùng trên mobile)
- **Backend:** Node.js với Express.js (API server)
- **Database:** MongoDB (lưu trữ dữ liệu người dùng, bài tập, tin nhắn)
- **Realtime Communication:** Socket.io (nhắn tin, thông báo)
- **Link Github Server: https://github.com/Namne2k3/fitness_app_server**

### 4. Giao diện
- **Giao điện đăng nhập:**

![Giao diện đăng nhập](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/auth/dang_nhap.png?raw=true)

- **Giao điện đăng ký:**

![Giao diện đăng ký](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/auth/dang_ky.png?raw=true)

- **Giao điện xác thực email:**

![Giao diện xác thực email](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/auth/xac_thuc_email.png?raw=true)

- **Giao điện thiết lập tài khoản:**

![Giao diện thiết lập tài khoản 1](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/initialSetting/thiet_lap_1.png?raw=true)
![Giao diện thiết lập tài khoản 2](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/initialSetting/thiet_lap_2.png?raw=true)
![Giao diện thiết lập tài khoản 3](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/initialSetting/thiet_lap_3.png?raw=true)
![Giao diện thiết lập tài khoản 4](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/initialSetting/thiet_lap_4.png?raw=true)
![Giao diện thiết lập tài khoản 5](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/initialSetting/thiet_lap_5.png?raw=true)

- **Giao điện trang chủ kế hoạch:**

![Giao diện trang chủ kế hoạch](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/app/trang_chu_ke_hoach.png?raw=true)

- **Giao điện trang chủ luyện tập:**

![Giao diện trang chủ kế hoạch](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/app/trang_chu_luyen_tap.png?raw=true)

- **Giao điện trang chủ bài đăng:**

![Giao diện trang chủ bài đăng](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/app/trang_chu_blog.png?raw=true)

- **Giao điện tra cứu thực phẩm:**

![Giao diện tra cứu thực phẩm](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/app/thuc_pham.png?raw=true)

- **Giao điện tra cứu bài tập:**

![Giao diện tra cứu bài tập](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/app/bai_tap.png?raw=true)

- **Giao điện tùy chỉnh bài tập:**

![Giao diện tùy chỉnh bài tập](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/app/tuy_chinh_bai_tap.png?raw=true)

- **Giao điện thiết lập thông báo:**

![Giao diện thiết lập thông báo](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/app/thiet_lap_thong_bao.png?raw=true)

- **Giao điện thống kê chỉ số tập luyện:**

![Giao diện thống kế chỉ số tập luyện #1](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/app/thong_ke_1.png?raw=true)
![Giao diện thống kế chỉ số tập luyện #2](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/app/thong_ke_2.png?raw=true)

- **Giao điện nhắn tin:**

![Giao diện nhắn tin #1](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/app/nhan_tin_1.png?raw=true)
![Giao diện nhắn tin #1](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/app/nhan_tin_2.png?raw=true)

- **Giao điện đăng phản hồi:**

![Giao diện đăng phản hồi #1](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/app/phan_hoi_1.png?raw=true)
![Giao diện đăng phản hồi #2](https://github.com/Namne2k3/fitness_app_client/blob/main/pics/app/phan_hoi_2.png?raw=true)

