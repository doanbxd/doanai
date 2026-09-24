import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, MessageCircle, Phone } from "lucide-react";

import qrNganHang from "@/assets/qr-ngan-hang.jpg";
import qrZalo from "@/assets/qr-zalo.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";
import { submitRegistration } from "@/lib/marketing.functions";
import { LIEN_HE, SAN_PHAM, TAI_LIEU, THANH_TOAN, dinhDangTien, linkQr, noiDungChuyenKhoan } from "@/lib/san-pham";

export const Route = createFileRoute("/dang-ky")({
  head: () => ({
    meta: [
      { title: "Đăng ký nhận bộ tài liệu | Mua Nhà Không Mất Tiền Oan" },
      { name: "description", content: `Chuyển khoản ${dinhDangTien(SAN_PHAM.gia)} và nhắn Zalo để nhận trọn bộ 5 tài liệu.` },
    ],
  }),
  component: DangKy,
});

type Khach = { ten: string; sdt: string };

function laSdtHopLe(sdt: string) {
  return /^0\d{9}$/.test(sdt.replace(/\D/g, ""));
}

function DongThongTin({ nhan, giaTri, chepDuoc }: { nhan: string; giaTri: string; chepDuoc?: boolean }) {
  const [daChep, setDaChep] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 text-sm">
      <span className="text-muted-foreground">{nhan}</span>
      <span className="flex items-center gap-2 text-right font-bold">
        {giaTri}
        {chepDuoc ? (
          <button
            type="button"
            aria-label={`Chép ${nhan}`}
            className="rounded-md p-1 text-primary hover:bg-primary-soft"
            onClick={() => {
              void navigator.clipboard?.writeText(giaTri.replace(/\s/g, nhan === "Nội dung CK" ? " " : ""));
              setDaChep(true);
              setTimeout(() => setDaChep(false), 1500);
            }}
          >
            {daChep ? <Check className="size-4" /> : <Copy className="size-4" />}
          </button>
        ) : null}
      </span>
    </div>
  );
}

function DangKy() {
  const [khach, setKhach] = useState<Khach | null>(null);
  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [qrLoi, setQrLoi] = useState(false);
  const luuDon = useServerFn(submitRegistration);

  useEffect(() => {
    void trackEvent("page_view", { page: "dang-ky" });
  }, []);

  async function guiForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const ten = String(f.get("ten") ?? "").trim();
    const sdt = String(f.get("sdt") ?? "").replace(/\D/g, "");
    if (!ten) return setLoi("Anh chị vui lòng nhập họ tên.");
    if (!laSdtHopLe(sdt)) return setLoi("Số điện thoại chưa đúng (10 số, bắt đầu bằng 0).");
    setLoi(null);
    setDangGui(true);
    try {
      // Chờ lưu đơn tối đa 4 giây, quá thì cứ hiện QR cho khách (đơn vẫn lưu tiếp phía sau).
      await Promise.race([
        luuDon({ data: { fullName: ten, phone: sdt, amount: SAN_PHAM.gia } }),
        new Promise((r) => setTimeout(r, 4000)),
      ]);
    } catch (err) {
      // Lưu đơn lỗi thì vẫn cho khách thanh toán — không để mất khách vì lỗi kỹ thuật.
      console.warn("Chưa lưu được đơn", err);
    } finally {
      setDangGui(false);
    }
    void trackEvent("registration_submitted", { amount: SAN_PHAM.gia });
    setKhach({ ten, sdt });
    setTimeout(() => document.getElementById("thanh-toan")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  const noiDung = khach ? noiDungChuyenKhoan(khach.sdt) : "";

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-8 text-foreground sm:pt-12">
      <div className="mx-auto max-w-xl">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" /> Xem lại nội dung tài liệu
        </Link>

        <div className="mt-6 text-center">
          <h1 className="font-display text-4xl font-bold uppercase text-primary sm:text-5xl">Đăng ký nhận tài liệu</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">{SAN_PHAM.ten}</p>
        </div>

        {/* Hướng dẫn 3 bước */}
        <section className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <CheckCircle2 className="size-5 text-primary" /> Hướng dẫn đăng ký
          </h2>
          <ol className="mt-4 space-y-3 text-sm sm:text-base">
            {[
              `Điền họ tên, số điện thoại rồi chuyển khoản ${dinhDangTien(SAN_PHAM.gia)} theo mã QR bên dưới`,
              `Nhắn Zalo ${LIEN_HE.sdt} kèm ảnh giao dịch chuyển khoản`,
              "Nhận trọn bộ 5 tài liệu qua Zalo ngay sau khi xác nhận",
            ].map((b, i) => (
              <li key={b} className="flex items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                <span className="pt-0.5">{b}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Thẻ sản phẩm + form */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-panel">
          <div className="bg-primary px-5 py-4 text-primary-foreground sm:px-6">
            <h2 className="text-lg font-bold sm:text-xl">Trọn bộ 5 tài liệu mua nhà</h2>
            <p className="text-sm opacity-90">Đọc 30 phút — tránh mất tiền oan cả đời</p>
          </div>
          <div className="p-5 sm:p-6">
            <p className="text-sm font-bold">Anh chị sẽ nhận được:</p>
            <ul className="mt-3 space-y-2 text-sm">
              {TAI_LIEU.map((t) => (
                <li key={t.ma} className="flex gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {t.ten} <span className="text-muted-foreground">({t.dang.split(" · ")[0]})</span>
                </li>
              ))}
              <li className="flex gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" /> 15 phút tư vấn một–một miễn phí
              </li>
            </ul>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">Số tiền chuyển khoản</p>
              <p className="font-display text-5xl font-bold text-primary">{dinhDangTien(SAN_PHAM.gia)}</p>
            </div>

            {khach ? (
              <div className="mt-6 flex items-center justify-between gap-3 rounded-lg bg-success-soft px-4 py-3 text-sm text-success">
                <span>
                  <b>{khach.ten}</b> · {khach.sdt}
                </span>
                <button type="button" className="font-semibold underline-offset-4 hover:underline" onClick={() => setKhach(null)}>
                  Sửa
                </button>
              </div>
            ) : (
              <form onSubmit={guiForm} className="mt-6" noValidate>
                <label className="block text-sm font-semibold" htmlFor="ten">Họ và tên</label>
                <Input id="ten" name="ten" autoComplete="name" className="mt-2 h-11" placeholder="Nguyễn Văn An" />
                <label className="mt-4 block text-sm font-semibold" htmlFor="sdt">Số điện thoại (Zalo)</label>
                <Input id="sdt" name="sdt" type="tel" inputMode="numeric" autoComplete="tel" className="mt-2 h-11" placeholder="09xx xxx xxx" />
                <Button type="submit" variant="conversion" size="xl" className="mt-6 w-full" disabled={dangGui}>
                  {dangGui ? "Đang tạo mã QR..." : "Đăng ký & hiện mã QR thanh toán"} <ArrowRight />
                </Button>
                {loi ? <p className="mt-3 text-sm font-medium text-destructive" role="alert">{loi}</p> : null}
                <p className="mt-3 text-center text-[11px] leading-5 text-muted-foreground">Số điện thoại chỉ dùng để gửi tài liệu cho anh chị.</p>
              </form>
            )}
          </div>
        </section>

        {/* Thanh toán — chỉ hiện sau khi đăng ký */}
        {khach ? (
          <section id="thanh-toan" className="mt-6 scroll-mt-6 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
              <h2 className="text-lg font-bold">Bước 1 · Quét mã để chuyển khoản</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Mã QR đã có sẵn số tiền {dinhDangTien(SAN_PHAM.gia)} và nội dung chuyển khoản. Mở app ngân hàng, quét là xong.
              </p>
              <div className="mx-auto mt-5 w-full max-w-72 rounded-xl border border-border bg-white p-3">
                {qrLoi ? (
                  <img src={qrNganHang} alt="Mã QR chuyển khoản VPBank" className="w-full" />
                ) : (
                  <img
                    src={linkQr(khach.sdt)}
                    alt={`Mã QR chuyển khoản ${dinhDangTien(SAN_PHAM.gia)}`}
                    className="w-full"
                    onError={() => setQrLoi(true)}
                  />
                )}
              </div>
              {qrLoi ? (
                <p className="mt-3 text-center text-xs font-medium text-destructive">
                  Mã QR này chưa có sẵn số tiền — anh chị nhập {dinhDangTien(SAN_PHAM.gia)} và nội dung bên dưới giúp em.
                </p>
              ) : null}
              <div className="mt-5 divide-y divide-border rounded-xl bg-surface px-4">
                <DongThongTin nhan="Ngân hàng" giaTri={THANH_TOAN.nganHang} />
                <DongThongTin nhan="Chủ tài khoản" giaTri={THANH_TOAN.chuTaiKhoan} />
                <DongThongTin nhan="Số tài khoản" giaTri={THANH_TOAN.soTaiKhoan} chepDuoc />
                <DongThongTin nhan="Số tiền" giaTri={dinhDangTien(SAN_PHAM.gia)} />
                <DongThongTin nhan="Nội dung CK" giaTri={noiDung} chepDuoc />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <MessageCircle className="size-5 text-primary" /> Bước 2 · Xác nhận qua Zalo
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Chuyển khoản xong, anh chị nhắn Zalo kèm ảnh giao dịch để em gửi tài liệu nhanh nhất.
              </p>
              <a href={LIEN_HE.telUrl} className="mt-5 flex items-center gap-4 rounded-xl bg-surface p-4">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Phone className="size-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase text-muted-foreground">Số Zalo · điện thoại</span>
                  <span className="text-2xl font-extrabold">{LIEN_HE.sdt}</span>
                </span>
              </a>
              <Button asChild variant="conversion" size="xl" className="mt-4 w-full">
                <a href={LIEN_HE.zaloUrl} target="_blank" rel="noreferrer" onClick={() => void trackEvent("zalo_click", { sdt: khach.sdt })}>
                  Tôi đã chuyển khoản · Nhắn Zalo <ArrowRight />
                </a>
              </Button>
              <ul className="mt-5 space-y-2 text-sm">
                {["Gửi ảnh giao dịch chuyển khoản", "Nhận xác nhận và trọn bộ 5 file tài liệu", "Hỏi em 15 phút về đúng bước anh chị đang vướng"].map((y) => (
                  <li key={y} className="flex gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /> {y}
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-border pt-5 text-center">
                <p className="text-sm font-semibold">Hoặc quét mã để kết bạn Zalo</p>
                <img src={qrZalo} alt="Mã QR Zalo Bùi Xuân Đoàn" loading="lazy" className="mx-auto mt-3 w-52 rounded-xl border border-border" />
              </div>
            </div>
          </section>
        ) : null}

        <footer className="mt-10 text-right text-sm font-bold leading-6">
          {LIEN_HE.ten}
          <br />
          {LIEN_HE.sdt}
        </footer>
      </div>
    </main>
  );
}
