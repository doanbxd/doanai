// Cấu hình bán hàng — sửa giá, tài khoản, Zalo ở MỘT chỗ này là cả trang đổi theo.

export const SAN_PHAM = {
  ten: "Bộ Tài Liệu Mua Nhà Không Mất Tiền Oan",
  gia: 50_000,
};

export const THANH_TOAN = {
  nganHang: "VPBank",
  maNganHang: "VPB", // mã VietQR của VPBank
  soTaiKhoan: "777979868",
  chuTaiKhoan: "BUI XUAN DOAN",
  // Nội dung chuyển khoản = tiền tố + số điện thoại khách, để đối chiếu đơn nhanh.
  tienToNoiDung: "TAILIEU",
};

export const LIEN_HE = {
  ten: "Xuân Đoàn",
  hoTen: "Bùi Xuân Đoàn",
  sdt: "0909 889 678",
  zaloUrl: "https://zalo.me/0909889678",
  telUrl: "tel:0909889678",
};

export const TAI_LIEU = [
  {
    ma: "01",
    ten: "Cẩm nang 7 bước mua nhà không mất tiền oan",
    dang: "Word · 30 phút đọc",
    moTa: "Lộ trình từ lúc xem đất tới lúc cầm sổ trên tay, kèm bảng kiểm nhanh in ra gấp bỏ ví.",
  },
  {
    ma: "02",
    ten: "15 câu hỏi sống còn trước khi xuống tiền",
    dang: "PDF · 2 trang",
    moTa: "15 câu chặn 90% rủi ro mất cọc, trong đó có 5 câu vàng — chỉ kịp hỏi 5 câu thì hỏi đúng 5 câu này.",
  },
  {
    ma: "03",
    ten: "6 điều khoản sống còn trong hợp đồng đặt cọc",
    dang: "Word · có câu mẫu",
    moTa: "Kèm câu mẫu ghi thẳng vào hợp đồng và 3 câu bên bán hay né — né là có vấn đề.",
  },
  {
    ma: "04",
    ten: "Bảng tính khả năng trả nợ an toàn",
    dang: "Word · 5 phút",
    moTa: "Biết chính xác mình gánh nổi bao nhiêu, 3 phép thử sức chịu đựng và bẫy lãi suất ưu đãi.",
  },
  {
    ma: "05",
    ten: "Bảng tính ROI bất động sản trong 2 phút",
    dang: "Excel · tự tính",
    moTa: "Chỉ điền ô vàng: ra lời lỗ, 3 kịch bản thị trường, tiền trả góp mỗi tháng và so với gửi tiết kiệm.",
  },
];

export function dinhDangTien(so: number) {
  return so.toLocaleString("vi-VN") + "đ";
}

export function noiDungChuyenKhoan(sdt: string) {
  const so = sdt.replace(/\D/g, "");
  return `${THANH_TOAN.tienToNoiDung} ${so}`.trim();
}

export function linkQr(sdt: string) {
  const q = new URLSearchParams({
    amount: String(SAN_PHAM.gia),
    addInfo: noiDungChuyenKhoan(sdt),
    accountName: THANH_TOAN.chuTaiKhoan,
  });
  return `https://img.vietqr.io/image/${THANH_TOAN.maNganHang}-${THANH_TOAN.soTaiKhoan}-compact2.png?${q}`;
}
