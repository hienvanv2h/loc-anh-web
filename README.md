# ỨNG DỤNG LỌC ẢNH TẦN SỐ TRÊN NỀN WEB

## 1. Cấu trúc project:

Xem tệp files-tree.txt

## 2. THIẾT LẬP MÔI TRƯỜNG ẢO CHO PROJECT:

- Xem danh sách môi trường ảo trong conda:

  > conda env list

- Tạo một môi trường ảo:

  > conda create --name new_venv opencv-python

  Có thể thay opencv-python bằng một thư viện khác đã có trong conda list

- Kích hoạt môi trường ảo:
  > conda activate new_venv

## 3. CẬP NHẬT CÁC THƯ VIỆN CẦN THIẾT CHO PROJECT:

- Tải các thư viện trong tệp requirements.txt:
  > pip install -r requirements.txt

## 4. TẠO CƠ SỞ DỮ LIỆU SQLITE3

- Kiểm tra thay đổi và sẵn sàng để cập nhật thay đổi:
  > python manage.py makemigrations
- Xác nhận và tiến hành cập nhật thay đổi:
  > python manage.py migrate

## 5. CHẠY CHƯƠNG TRÌNH:

> python manage.py runserver

## TÀI LIỆU SỬ DỤNG DJANGO

<https://docs.djangoproject.com/en/5.0/>
