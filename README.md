# Web ZennezMC

Web tĩnh (HTML/CSS/JS), không cần VPS hay hosting trả phí.

## Cấu trúc
- `index.html` — trang chủ (IP, tính năng, cách tham gia)
- `wiki.html` — wiki có ô tìm kiếm
- `js/config.js` — **sửa ở đây**: IP, cổng Bedrock, link Discord
- `css/style.css` — giao diện, màu sắc
- `assets/` — logo và favicon

## Việc cần làm trước khi đưa lên
1. Mở `js/config.js`, thay `https://discord.gg/your-invite` bằng link mời Discord thật.

## Đưa lên mạng (Cloudflare Pages)
1. Tạo repository mới trên GitHub, kéo thả toàn bộ file trong thư mục này lên (giữ nguyên cấu trúc thư mục).
2. Vào Cloudflare → Workers & Pages → Create → Pages → Connect to Git → chọn repository.
3. Build command: để trống. Output directory: để trống (hoặc `/`). Bấm Deploy.
4. Vào Custom domains → thêm `www.zennez.net` (hoặc subdomain khác).

## Trỏ tên miền ở Vietnix
- Vào DNS của tên miền trên Vietnix, thêm bản ghi: **CNAME**, tên `www`, giá trị `<ten-project>.pages.dev`.
- **Không xóa** các bản ghi cũ (A, SRV... của `play`), nếu không IP vào game sẽ hỏng.
- Muốn dùng thẳng `zennez.net` (không có www) thì cần chuyển nameserver sang Cloudflare; hãy chép lại toàn bộ bản ghi cũ trước khi đổi.

## Chỉnh nội dung
- Thêm mục wiki: copy một khối `<article class="doc" id="...">` trong `wiki.html`, rồi thêm một dòng vào danh sách `#toc`.
- Đổi màu: sửa các biến ở đầu `css/style.css` (phần `:root`).
- Trạng thái online lấy từ api.mcsrvstat.us. Muốn tắt: đặt `showStatus: false` trong `config.js`.
