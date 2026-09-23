import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  Bot,
  CalendarDays,
  Check,
  Code2,
  Gift,
  Lightbulb,
  Network,
  Play,
  Sparkles,
  Store,
  Users,
} from "lucide-react";

import heroImage from "@/assets/ai-workshop-hero.jpg";
import speakerImage from "@/assets/ai-educator.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LearningPathPlanner } from "@/components/LearningPathPlanner";
import { trackEvent } from "@/lib/analytics";
import { submitRegistration } from "@/lib/marketing.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Agent Thực Chiến | Workshop xây hệ thống làm việc 24/7" },
      {
        name: "description",
        content:
          "Tham gia workshop thực chiến để tự xây đội ngũ AI Agent, tự động hóa công việc và biến kỹ năng thành sản phẩm.",
      },
      { property: "og:title", content: "AI Agent Thực Chiến | Workshop xây hệ thống làm việc 24/7" },
      {
        property: "og:description",
        content: "Một buổi thực hành giúp bạn biến AI từ công cụ hỏi đáp thành đội ngũ làm việc thực sự.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const benefits = [
  {
    icon: Bot,
    title: "Sở hữu đội AI Agent làm việc theo quy trình",
    description: "Tạo một nhóm trợ lý biết nghiên cứu, viết nội dung và kiểm tra kết quả theo đúng mục tiêu của bạn.",
  },
  {
    icon: Network,
    title: "Xây hệ thống sub-agent khác biệt",
    description: "Phân vai thông minh để nhiều agent phối hợp, giúp công việc nhanh hơn mà vẫn giữ chất lượng.",
  },
  {
    icon: Code2,
    title: "Tự dựng ứng dụng cho công việc riêng",
    description: "Biến nhu cầu hằng ngày thành công cụ AI dễ dùng, không còn phụ thuộc vào quy trình thủ công.",
  },
  {
    icon: Store,
    title: "Đóng gói kỹ năng thành sản phẩm",
    description: "Hiểu cách hoàn thiện, trình bày và đưa một kỹ năng AI ra thị trường theo hướng bền vững.",
  },
  {
    icon: Gift,
    title: "Bộ tài nguyên thực hành độc quyền",
    description: "Nhận mẫu quy trình, checklist triển khai và thư viện gợi ý để bắt đầu ngay sau buổi học.",
  },
  {
    icon: Lightbulb,
    title: "Mở rộng ý tưởng tạo thu nhập",
    description: "Khám phá các mô hình ứng dụng AI phù hợp cho người làm nội dung, kinh doanh và dịch vụ.",
  },
];

function scrollToRegistration(source: string) {
  void trackEvent("cta_click", { source });
  document.getElementById("dang-ky")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function Index() {
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const register = useServerFn(submitRegistration);

  useEffect(() => {
    void trackEvent("page_view");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setFormError(null);
    try {
      await register({
        data: {
          fullName: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
        },
      });
      void trackEvent("registration_submitted");
      setSubmitted(true);
    } catch {
      setFormError("Chưa gửi được thông tin. Bạn vui lòng kiểm tra lại và thử lần nữa.");
    } finally {
      setSaving(false);
    }
  }


  return (
    <main className="min-h-screen overflow-hidden bg-background pb-20 text-foreground sm:pb-0">
      <section className="hero-wash px-5 pb-14 pt-9 sm:pb-20 sm:pt-14">
        <div className="mx-auto max-w-5xl text-center">
          <div className="animate-rise inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-4 py-2 text-[11px] font-bold uppercase text-primary sm:text-xs">
            <span className="size-1.5 rounded-full bg-primary" />
            Workshop thực chiến một lần duy nhất
          </div>
          <h1 className="animate-rise mt-6 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
            XÂY ĐỘI AI AGENT
            <br />
            <span className="text-primary">LÀM VIỆC THAY BẠN 24/7</span>
          </h1>
          <p className="animate-rise mx-auto mt-4 max-w-2xl text-base font-medium text-muted-foreground sm:text-xl">
            Từ những tác vụ rời rạc thành một hệ thống AI phối hợp, chủ động và tạo ra kết quả thực sự.
          </p>
          <div className="animate-rise mt-6 inline-flex items-center gap-3 rounded-full border border-primary/25 bg-card px-5 py-3 text-sm font-bold shadow-soft sm:text-base">
            <CalendarDays className="size-5 text-primary" aria-hidden="true" />
            20:00 · Chủ nhật, 18/10/2026
          </div>

          <div className="hero-frame animate-rise relative mx-auto mt-8 overflow-hidden rounded-lg border-2 border-primary bg-ink shadow-glow">
            <img
              src={heroImage}
              width={1536}
              height={864}
              alt="Không gian làm việc AI với hệ thống nhiều agent trên màn hình"
              className="aspect-video w-full object-cover"
            />
            <div className="absolute inset-y-0 left-0 flex w-[54%] items-center bg-gradient-to-r from-ink via-ink/90 to-transparent p-6 text-left sm:p-10 lg:p-14">
              <div>
                <span className="text-xs font-bold uppercase text-primary sm:text-sm">AI Agent thực chiến</span>
                <p className="mt-2 text-2xl font-extrabold leading-tight text-ink-foreground sm:text-4xl lg:text-5xl">
                  Giao việc một lần.
                  <br />
                  Hệ thống tự vận hành.
                </p>
                <div className="mt-5 hidden items-center gap-2 text-sm font-medium text-ink-muted sm:flex">
                  <Check className="size-4 text-primary" /> Không lý thuyết dài dòng
                </div>
              </div>
            </div>
          </div>

          <p className="mt-8 text-sm text-muted-foreground sm:text-base">
            Bạn muốn tiếp tục tự làm mọi thứ, hay bắt đầu xây hệ thống cho riêng mình?
          </p>
          <Button className="mt-5" variant="conversion" size="xl" onClick={scrollToRegistration}>
            Giữ chỗ & nhận bộ tài nguyên <ArrowRight aria-hidden="true" />
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">Số lượng giới hạn để đảm bảo chất lượng hướng dẫn</p>

          <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-3 rounded-lg border border-success/30 bg-success-soft px-5 py-4 text-sm font-semibold text-success">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-50" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            Cổng đăng ký đang mở · Còn 38 suất tham dự
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-24" aria-labelledby="benefit-title">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="section-kicker">Giá trị mang về</span>
            <h2 id="benefit-title" className="mt-3 text-3xl font-extrabold sm:text-5xl">
              Một buổi học, <span className="text-primary">sáu bước tiến</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Mỗi nội dung đều hướng đến một kết quả bạn có thể áp dụng ngay vào công việc.
            </p>
          </div>

          <div className="mt-10 divide-y divide-border border-y border-border">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <article key={benefit.title} className="benefit-row group grid gap-4 py-6 sm:grid-cols-[5rem_3.5rem_1fr_auto] sm:items-center sm:gap-5">
                  <span className="text-4xl font-extrabold text-primary sm:text-5xl">{String(index + 1).padStart(2, "0")}</span>
                  <span className="flex size-12 items-center justify-center rounded-lg border border-primary/25 bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold sm:text-xl">{benefit.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground sm:text-base">{benefit.description}</p>
                  </div>
                  <ArrowRight className="hidden size-5 text-primary transition-transform group-hover:translate-x-1 sm:block" aria-hidden="true" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface px-5 py-16 sm:py-24" aria-labelledby="speaker-title">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="section-kicker">Người đồng hành</span>
            <h2 id="speaker-title" className="mt-3 text-3xl font-extrabold sm:text-5xl">Diễn giả workshop</h2>
          </div>
          <div className="mt-10 grid items-center gap-8 border-y border-border py-10 md:grid-cols-[18rem_1fr] md:gap-12">
            <div className="relative mx-auto">
              <div className="absolute -inset-3 rounded-full border border-primary/25" />
              <img
                src={speakerImage}
                width={816}
                height={816}
                loading="lazy"
                alt="Diễn giả Minh An"
                className="relative aspect-square w-52 rounded-full object-cover shadow-soft md:w-64"
              />
              <span className="absolute bottom-2 right-0 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">AI BUILDER</span>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold">Minh An</h3>
              <p className="mt-1 font-semibold text-primary">AI Automation & Vibe Coding</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['AI Strategy', 'Content Systems', 'No-code'].map((tag) => (
                  <span key={tag} className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">{tag}</span>
                ))}
              </div>
              <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
                Người hướng dẫn tập trung vào cách biến AI thành quy trình làm việc rõ ràng, giúp cá nhân và đội nhóm tiết kiệm thời gian, thử nghiệm nhanh và tạo ra sản phẩm thực tế.
              </p>
              <div className="mt-6 flex items-center gap-3 text-sm font-semibold">
                <Users className="size-5 text-primary" aria-hidden="true" /> Hơn 1.200 học viên đã tham gia các buổi chia sẻ
              </div>
            </div>
          </div>

          <div className="mt-16 grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="section-kicker">Xem trước nội dung</span>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Bắt đầu từ một quy trình có thể nhìn thấy</h2>
              <p className="mt-4 leading-7 text-muted-foreground">Xem cách tư duy hệ thống giúp bạn phân vai, giao việc và kiểm soát chất lượng đầu ra của AI.</p>
              <Button className="mt-6" variant="conversion" size="xl" onClick={scrollToRegistration}>Đăng ký ngay <ArrowRight /></Button>
            </div>
            <div className="relative overflow-hidden rounded-lg border border-border bg-ink shadow-soft">
              <div className="aspect-video">
                <iframe
                  className="size-full"
                  src="https://www.youtube.com/embed/K2H9p7IGhdo?rel=0"
                  title="Video giới thiệu ứng dụng AI trong công việc"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <span className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-card/90 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
                <Play className="size-3 fill-primary text-primary" /> Video giới thiệu
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="dang-ky" className="registration-band scroll-mt-8 px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_26rem] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase text-primary"><Sparkles className="size-4" /> Bắt đầu hôm nay</span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-ink-foreground sm:text-5xl">Đừng chỉ dùng AI.<br />Hãy xây đội ngũ AI của bạn.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink-muted sm:text-lg">Để lại thông tin để giữ chỗ và nhận bộ tài nguyên chuẩn bị trước workshop.</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition-colors hover:text-primary">
              Xem lại nội dung <ArrowDown className="size-4 rotate-180" />
            </button>
          </div>

          <div className="rounded-lg bg-card p-6 shadow-panel sm:p-8">
            {submitted ? (
              <div className="flex min-h-64 flex-col items-center justify-center text-center" role="status">
                <span className="flex size-14 items-center justify-center rounded-full bg-success-soft text-success"><Check className="size-7" /></span>
                <h3 className="mt-5 text-xl font-bold">Đã giữ chỗ thành công!</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Thông tin hướng dẫn sẽ được gửi đến bạn. Hẹn gặp bạn tại workshop.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-bold">Giữ chỗ miễn phí</h3>
                <p className="mt-1 text-sm text-muted-foreground">Điền thông tin để nhận xác nhận tham dự.</p>
                <label className="mt-6 block text-sm font-semibold" htmlFor="name">Họ và tên</label>
                <Input id="name" name="name" required autoComplete="name" className="mt-2 h-11" placeholder="Nguyễn Minh Anh" />
                <label className="mt-4 block text-sm font-semibold" htmlFor="email">Email</label>
                <Input id="email" name="email" type="email" required autoComplete="email" className="mt-2 h-11" placeholder="ban@email.com" />
                <label className="mt-4 block text-sm font-semibold" htmlFor="phone">Số điện thoại</label>
                <Input id="phone" name="phone" type="tel" required autoComplete="tel" className="mt-2 h-11" placeholder="09xx xxx xxx" />
                <Button type="submit" variant="conversion" size="xl" className="mt-6 w-full">Nhận vé tham dự <ArrowRight /></Button>
                <p className="mt-4 text-center text-[11px] leading-5 text-muted-foreground">Thông tin của bạn chỉ được dùng để gửi nội dung workshop.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-ink px-5 py-8 text-center text-xs text-ink-muted">
        © 2026 AI Agent Workshop · Học để xây, xây để tiến xa.
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 p-3 backdrop-blur-sm sm:hidden">
        <Button className="w-full" variant="conversion" size="xl" onClick={scrollToRegistration}>Giữ chỗ miễn phí <ArrowRight /></Button>
      </div>
    </main>
  );
}
