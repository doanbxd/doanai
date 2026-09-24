import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  Check,
  FileSpreadsheet,
  FileText,
  HandCoins,
  Home,
  Landmark,
  MessageCircle,
  Phone,
  ScrollText,
  ShieldCheck,
  X,
} from "lucide-react";

import anhBia from "@/assets/anh-bia-bo-tai-lieu.jpg";
import tacGia from "@/assets/anh-tac-gia.jpg";
import tacGia2 from "@/assets/anh-tac-gia-2.jpg";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { LIEN_HE, SAN_PHAM, TAI_LIEU, dinhDangTien } from "@/lib/san-pham";

const TIEU_DE = "Mua Nhà Không Mất Tiền Oan | Bộ 5 tài liệu dành cho người mua Bất động sản";
const MO_TA =
  "Cẩm nang 7 bước, 15 câu hỏi sống còn, 6 điều khoản hợp đồng cọc, bảng tính trả nợ an toàn và bảng tính ROI — trọn bộ 50.000đ.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TIEU_DE },
      { name: "description", content: MO_TA },
      { property: "og:title", content: TIEU_DE },
      { property: "og:description", content: MO_TA },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://doanai.lovable.app/" },
      // Ảnh hiện khi gửi link qua Zalo/Facebook — file public/anh-chia-se.jpg
      { property: "og:image", content: "https://doanai.lovable.app/anh-chia-se.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://doanai.lovable.app/anh-chia-se.jpg" },
    ],
  }),
  component: Index,
});

const NOI_DAU = [
  { tieuDe: "Đặt cọc trước, kiểm tra quy hoạch sau", moTa: "Một dòng lộ giới trên bản đồ có thể lấy đi cả khoản cọc vài trăm triệu." },
  { tieuDe: "Tin một câu nói miệng của người bán", moTa: "“Đất này không dính gì đâu anh” — nhưng không ai đưa ra được văn bản." },
  { tieuDe: "Không biết còn phải nộp thêm bao nhiêu", moTa: "Thuế, phí, sửa chữa, nội thất… thiếu vài trăm triệu ở phút chót." },
  { tieuDe: "Không vay được Ngân hàng sau khi cọc", moTa: "Hợp đồng cọc thiếu điều khoản ngân hàng thì mất cọc, dù mình không sai." },
];

const BAY_BUOC = [
  "Xác định năng lực tài chính thật",
  "Chốt tiêu chí và khoanh vùng",
  "Xem thực địa và soi hiện trạng",
  "Kiểm tra pháp lý và quy hoạch",
  "Đặt cọc đúng cách",
  "Công chứng và thanh toán",
  "Sang tên và nhận sổ",
];

const ICON_TAI_LIEU = [ScrollText, FileText, HandCoins, Calculator, FileSpreadsheet];

const DANH_CHO = [
  { icon: Home, tieuDe: "Người đang tìm mua nhà đất", moTa: "Muốn đi đúng từng bước, không bỏ sót chỗ dễ mất tiền nào." },
  { icon: HandCoins, tieuDe: "Người sắp đặt cọc", moTa: "Đã ưng một lô, cần rà lại pháp lý và hợp đồng trước khi đưa tiền." },
  { icon: Landmark, tieuDe: "Người mua có vay ngân hàng", moTa: "Muốn biết mình vay bao nhiêu là an toàn, không gồng lãi sau 2–3 năm." },
];

const HOI_DAP = [
  {
    hoi: "Tôi nhận tài liệu bằng cách nào?",
    dap: `Sau khi chuyển khoản, anh chị nhắn Zalo ${LIEN_HE.sdt} kèm ảnh giao dịch. Em xác nhận và gửi trọn bộ 5 file qua Zalo.`,
  },
  {
    hoi: "Tài liệu ở định dạng gì?",
    dap: "File Word và PDF để đọc, in ra được. Bảng tính là file Excel, mở được bằng Excel hoặc Google Sheet, chỉ điền ô vàng là tự tính.",
  },
  {
    hoi: "Tôi ở xa Bà Rịa – Vũng Tàu có dùng được không?",
    dap: "Dùng được. Quy trình 7 bước, câu hỏi và điều khoản hợp đồng cọc áp dụng cho mọi giao dịch nhà đất. Phần nơi nộp hồ sơ theo bộ máy mới (cấp tỉnh và cấp xã) cũng đúng trên cả nước.",
  },
  {
    hoi: "Mua xong có được hỏi thêm không?",
    dap: "Có. Anh chị được 15 phút tư vấn một–một miễn phí về đúng bước đang vướng. Đã nhắm được lô nào thì gửi ảnh sổ và địa chỉ, em rà giúp phần pháp lý và quy hoạch trước khi anh chị đặt cọc.",
  },
];

function ghiNhanCta(nguon: string) {
  void trackEvent("cta_click", { source: nguon });
}

function NutDangKy({ nguon, className }: { nguon: string; className?: string }) {
  return (
    <Button asChild variant="conversion" size="xl" className={className}>
      <Link to="/dang-ky" onClick={() => ghiNhanCta(nguon)}>
        Bảo vệ tài sản của tôi · {dinhDangTien(SAN_PHAM.gia)} <ArrowRight aria-hidden="true" />
      </Link>
    </Button>
  );
}

function Index() {
  useEffect(() => {
    void trackEvent("page_view");
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-background pb-24 text-foreground sm:pb-0">
      <header className="border-b border-border bg-card/80 px-5 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Logo BĐS Thiện Nhân Vũng Tàu" width={40} height={40} className="size-10 rounded-full bg-white object-contain shadow-soft" />
            <span className="text-sm font-bold leading-tight sm:text-base">BĐS Thiện Nhân Vũng Tàu</span>
          </div>
          <a href={LIEN_HE.telUrl} className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-primary/30 bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary sm:text-sm">
            <Phone className="size-4" aria-hidden="true" /> {LIEN_HE.sdt}
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-wash relative px-5 pb-14 pt-10 sm:pb-20 sm:pt-14">
        <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="text-center lg:text-left">
            <div className="animate-rise inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-4 py-2 text-[11px] font-bold uppercase text-primary sm:text-xs">
              <span className="size-1.5 rounded-full bg-primary" />
              Bộ tài liệu dành cho người mua Bất động sản
            </div>
            <h1 className="font-display animate-rise mt-6 text-4xl font-bold uppercase leading-[1.1] sm:text-6xl">
              {dinhDangTien(SAN_PHAM.gia)} để bảo vệ
              <br />
              <span className="text-primary">
                cả một tài sản <span className="whitespace-nowrap">tiền tỷ</span>
              </span>
            </h1>
            <p className="animate-rise mx-auto mt-5 max-w-xl text-base font-medium text-muted-foreground sm:text-lg lg:mx-0">
              Chỉ cần thiếu một dòng trong hợp đồng cọc, hay tin một câu nói miệng, là vài trăm triệu có thể mất trắng. Bộ 5 tài
              liệu này giúp anh chị đi đúng thứ tự, trước khi đưa ra bất kỳ đồng nào.
            </p>
            <ul className="mx-auto mt-6 max-w-xl space-y-2.5 text-left text-sm font-medium sm:text-base lg:mx-0">
              {[
                "5 tài liệu: cẩm nang, câu hỏi, mẫu điều khoản cọc và 2 bảng tính",
                "Đọc trong 30 phút, dùng được cho mọi căn anh chị đi xem",
                "Kèm 15 phút tư vấn một–một miễn phí",
              ].map((y) => (
                <li key={y} className="flex gap-2.5">
                  <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /> {y}
                </li>
              ))}
            </ul>
            <NutDangKy nguon="hero" className="mt-8 w-full sm:w-auto" />
            <p className="mt-3 text-xs text-muted-foreground">Chuyển khoản {dinhDangTien(SAN_PHAM.gia)} · Nhận file qua Zalo</p>
          </div>

          {/* Ảnh bìa bộ tài liệu — thay file src/assets/anh-bia-bo-tai-lieu.jpg là đổi */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-4 rounded-3xl bg-primary/15 blur-2xl" aria-hidden="true" />
            <img
              src={anhBia}
              width={1080}
              height={1350}
              alt="Bộ 5 tài liệu Mua Nhà Không Mất Tiền Oan, trọn bộ 50.000đ"
              className="relative w-full rotate-1 rounded-2xl shadow-panel"
            />
          </div>
        </div>
      </section>

      {/* NỖI ĐAU */}
      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="section-kicker">Sự thật ít ai nói</span>
            <h2 className="font-display mt-3 text-3xl font-bold uppercase sm:text-5xl">
              Gần như không ai mất tiền <span className="text-primary">vì mua hớ giá</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Giá chênh vài phần trăm là chuyện thị trường. Còn mất trắng tiền cọc thì không phải thị trường — đó là thiếu quy trình.
              Đây là 4 cách người mua mất tiền hay gặp nhất:
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {NOI_DAU.map((n) => (
              <article key={n.tieuDe} className="flex gap-4 rounded-lg border border-border bg-card p-5 shadow-soft">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <X className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-bold">{n.tieuDe}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{n.moTa}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BÊN TRONG BỘ TÀI LIỆU */}
      <section className="bg-surface px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="section-kicker">Anh chị nhận được</span>
            <h2 className="font-display mt-3 text-3xl font-bold uppercase sm:text-5xl">
              Trọn bộ <span className="text-primary">5 tài liệu</span> trong một lần mua
            </h2>
          </div>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {TAI_LIEU.map((t, i) => {
              const Icon = ICON_TAI_LIEU[i] ?? FileText;
              return (
                <article key={t.ma} className="grid gap-3 py-6 sm:grid-cols-[4.5rem_3.5rem_1fr] sm:items-center sm:gap-5">
                  <span className="text-4xl font-extrabold text-primary">{t.ma}</span>
                  <span className="flex size-12 items-center justify-center rounded-lg border border-primary/25 bg-primary-soft text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold sm:text-xl">{t.ten}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground sm:text-base">{t.moTa}</p>
                    <span className="mt-2 inline-block rounded-full bg-card px-2.5 py-0.5 text-xs font-semibold text-muted-foreground ring-1 ring-border">{t.dang}</span>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <NutDangKy nguon="tai-lieu" className="w-full sm:w-auto" />
          </div>
        </div>
      </section>

      {/* GIÁ TRỊ SO VỚI GIÁ */}
      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="section-kicker">Anh chị thử tính xem</span>
            <h2 className="font-display mt-3 text-3xl font-bold uppercase sm:text-5xl">
              {dinhDangTien(SAN_PHAM.gia)}, <span className="text-primary">bằng đúng một ly trà sữa</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted-foreground">
              Ly trà sữa uống xong là hết. Còn {dinhDangTien(SAN_PHAM.gia)} này đứng phía sau một khoản cọc vài trăm triệu, một căn nhà
              vài tỷ, là tài sản anh chị tích góp cả đời.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border-2 border-success/40 bg-success-soft p-6">
              <h3 className="font-bold text-success">Chi {dinhDangTien(SAN_PHAM.gia)} trước khi cọc</h3>
              <ul className="mt-4 space-y-3 text-sm sm:text-base">
                {[
                  "Biết hỏi đúng 15 câu trước khi xuống tiền",
                  "Hợp đồng cọc có đủ 6 điều khoản bảo vệ người mua",
                  "Biết chắc mình vay nổi bao nhiêu, không gồng lãi",
                ].map((y) => (
                  <li key={y} className="flex gap-2.5">
                    <Check className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" /> {y}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-6">
              <h3 className="font-bold text-destructive">Bỏ qua bước chuẩn bị</h3>
              <ul className="mt-4 space-y-3 text-sm sm:text-base">
                {[
                  "Mất cọc vì không vay được Ngân hàng",
                  "Mua trúng đất dính quy hoạch, lộ giới",
                  "Ôm tranh chấp nhiều năm: tốn tiền luật sư, tiền đi lại, mất ăn mất ngủ",
                ].map((y) => (
                  <li key={y} className="flex gap-2.5">
                    <X className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" /> {y}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-lg font-bold leading-8">
            Giá trị của bộ tài liệu này, nhiều người chỉ thấy rõ sau khi đã lỡ vướng vào tranh chấp. Em mong anh chị thấy nó trước.
          </p>
          <p className="mt-3 text-center text-sm italic text-muted-foreground">
            Đây là mức giá ưu đãi em áp dụng trong thời gian này, để nhiều người mua nhà đất được tiếp cận nhất.
          </p>
          <div className="mt-8 text-center">
            <NutDangKy nguon="tra-sua" className="w-full sm:w-auto" />
          </div>
        </div>
      </section>

      {/* 7 BƯỚC + NGUYÊN TẮC SỐ MỘT */}
      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="section-kicker">Xương sống của bộ tài liệu</span>
            <h2 className="font-display mt-3 text-3xl font-bold uppercase sm:text-5xl">
              7 bước, xếp đúng <span className="text-primary">thứ tự rủi ro</span> xuất hiện
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Mỗi bước sau chỉ được làm khi bước trước đã sạch. Làm đúng thứ tự, phần lớn rủi ro tự biến mất trước khi anh chị kịp gặp nó.
            </p>
            <ol className="mt-6 space-y-2.5">
              {BAY_BUOC.map((b, i) => (
                <li key={b} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                  <span className="font-semibold">{b}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border-2 border-primary bg-primary-soft p-6 shadow-glow sm:p-8">
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase text-primary">
              <AlertTriangle className="size-4" aria-hidden="true" /> Nguyên tắc số một
            </span>
            <p className="font-display mt-4 text-2xl font-bold uppercase leading-snug sm:text-3xl">
              Không đưa một đồng nào trước khi kiểm tra xong pháp lý và quy hoạch
            </p>
            <p className="mt-4 leading-7 text-muted-foreground">
              Kể cả tiền “giữ chỗ”, kể cả năm triệu, kể cả “cọc thiện chí”. Một tài sản thật, giá đúng, pháp lý sạch sẽ không biến mất
              trong ba ngày anh chị đi tra cứu.
            </p>
            <p className="mt-4 rounded-lg bg-card p-4 text-sm leading-6">
              Trong tài liệu có sẵn <b>câu hỏi cứu mạng</b> khi người bán nói “đất này không dính quy hoạch gì đâu” — phản ứng của họ
              với câu hỏi này nói cho anh chị biết nhiều hơn mọi lời cam kết.
            </p>
          </div>
        </div>
      </section>

      {/* DÀNH CHO AI */}
      <section className="bg-surface px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="section-kicker">Bộ tài liệu này dành cho</span>
            <h2 className="font-display mt-3 text-3xl font-bold uppercase sm:text-5xl">Anh chị đang ở đâu trong hành trình?</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {DANH_CHO.map(({ icon: Icon, tieuDe, moTa }) => (
              <article key={tieuDe} className="rounded-lg border border-border bg-card p-6 shadow-soft">
                <span className="flex size-12 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{tieuDe}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{moTa}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TÁC GIẢ */}
      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="section-kicker">Người biên soạn</span>
            <h2 className="font-display mt-3 text-3xl font-bold uppercase sm:text-5xl">Đo trước, tin sau</h2>
          </div>
          <div className="mt-10 grid items-center gap-8 border-y border-border py-10 md:grid-cols-[18rem_1fr] md:gap-12">
            <div className="relative mx-auto w-full max-w-xs">
              <div className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl border-2 border-primary/40" aria-hidden="true" />
              <img
                src={tacGia}
                width={900}
                height={1125}
                loading="lazy"
                alt="Anh Bùi Xuân Đoàn tại văn phòng"
                className="relative aspect-[4/5] w-full rounded-2xl object-cover object-top shadow-panel"
              />
            </div>
            <div>
              <h3 className="text-3xl font-extrabold">{LIEN_HE.hoTen}</h3>
              <p className="mt-1 font-semibold text-primary">Chủ tịch HĐTV · Công ty TNHH BĐS Thiện Nhân Vũng Tàu</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["15+ năm nghề tại BR–VT", "Thẩm định pháp lý 4 lớp"].map((tag) => (
                  <span key={tag} className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">{tag}</span>
                ))}
              </div>
              <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
                Mười lăm năm ngồi đối diện hàng nghìn người mua nhà đất, em thấy người ta mất tiền không vì thiếu hiểu biết về giá,
                mà vì thiếu một quy trình. Bộ tài liệu này là quy trình đó — viết bằng ngôn ngữ đơn giản, dùng được ngay.
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="size-5 text-primary" aria-hidden="true" /> Không bán bất động sản bằng mọi giá — trao giải pháp an cư và đầu tư an toàn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HỎI ĐÁP */}
      <section className="bg-surface px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="section-kicker">Câu hỏi thường gặp</span>
            <h2 className="font-display mt-3 text-3xl font-bold uppercase sm:text-5xl">Trước khi đăng ký</h2>
          </div>
          <div className="mt-8 space-y-3">
            {HOI_DAP.map((h) => (
              <details key={h.hoi} className="group rounded-lg border border-border bg-card p-5 open:shadow-soft">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {h.hoi}
                  <span className="text-xl text-primary transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{h.dap}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CHỐT */}
      <section className="registration-band px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-10 text-center md:grid-cols-[1fr_17rem] md:text-left">
          <div>
          <h2 className="font-display text-3xl font-bold uppercase leading-tight text-ink-foreground sm:text-5xl">
            Một ly trà sữa
            <br />
            <span className="text-primary">hay một khoản cọc?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-ink-muted sm:text-lg md:mx-0">
            Hôm nay anh chị có thể tiết kiệm {dinhDangTien(SAN_PHAM.gia)}. Nhưng nếu một ngày phải ngồi giữa một vụ tranh chấp đất, anh
            chị sẽ sẵn sàng trả bao nhiêu cũng được, chỉ để quay lại lúc chưa ký. Đọc 30 phút trước khi cọc, giữ lại cả một tài sản
            phía sau.
            <br />
            <br />
            <b className="text-ink-foreground">Anh chị đang đứng ở bước nào trong 7 bước, và bước nào làm anh chị lo nhất?</b>
          </p>
          <NutDangKy nguon="chot" className="mt-8 w-full sm:w-auto" />
          <p className="mt-4 flex items-center justify-center gap-2 text-sm text-ink-muted md:justify-start">
            <MessageCircle className="size-4" aria-hidden="true" /> Cần hỏi trước? Zalo{" "}
            <a href={LIEN_HE.zaloUrl} target="_blank" rel="noreferrer" className="font-bold text-primary underline-offset-4 hover:underline">
              {LIEN_HE.sdt}
            </a>
          </p>
          </div>
          <img
            src={tacGia2}
            width={900}
            height={1114}
            loading="lazy"
            alt="Anh Bùi Xuân Đoàn"
            className="mx-auto hidden w-full max-w-xs rounded-2xl border border-white/10 object-cover shadow-panel md:block"
          />
        </div>
      </section>

      <footer className="border-t border-border bg-ink px-5 py-8 text-ink-muted">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-xs leading-5">
            Tài liệu mang tính tham khảo, biên soạn theo kinh nghiệm thực tế và quy định tại thời điểm biên soạn.
            <br />© 2026 BĐS Thiện Nhân Vũng Tàu · Nơi thực hiện ước mơ của bạn!
          </p>
          <p className="text-right font-bold leading-6 text-ink-foreground">
            {LIEN_HE.ten}
            <br />
            {LIEN_HE.sdt}
          </p>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 p-3 backdrop-blur-sm sm:hidden">
        <NutDangKy nguon="thanh-duoi" className="w-full" />
      </div>
    </main>
  );
}
