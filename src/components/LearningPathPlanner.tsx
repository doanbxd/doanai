import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateLearningPath, type LearningPath } from "@/lib/marketing.functions";
import { trackEvent } from "@/lib/analytics";

const levels = ["Mới bắt đầu", "Đã dùng AI cơ bản", "Đã tự động hóa một phần"];

export function LearningPathPlanner() {
  const createPath = useServerFn(generateLearningPath);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [path, setPath] = useState<LearningPath | null>(null);
  const [level, setLevel] = useState(levels[0]!);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const goal = String(form.get("goal") ?? "").trim();
    if (goal.length < 10) {
      setError("Hãy mô tả mục tiêu chi tiết hơn một chút (tối thiểu 10 ký tự).");
      return;
    }
    setLoading(true);
    setError(null);
    void trackEvent("learning_path_requested", { level });
    try {
      const result = await createPath({ data: { goal, level } });
      setPath(result);
    } catch {
      setError("Chưa tạo được lộ trình lúc này. Bạn thử lại sau ít phút nhé.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-5 py-16 sm:py-24" aria-labelledby="lo-trinh-title">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="section-kicker">Cá nhân hóa bằng AI</span>
          <h2 id="lo-trinh-title" className="mt-3 text-3xl font-extrabold sm:text-5xl">
            Lộ trình học <span className="text-primary">riêng cho bạn</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Mô tả mục tiêu của bạn, AI sẽ gợi ý lộ trình 4 tuần cùng những việc cần làm mỗi tuần.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[24rem_1fr] lg:items-start">
          <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 shadow-soft">
            <label className="block text-sm font-semibold" htmlFor="goal">
              Mục tiêu học tập của bạn
            </label>
            <textarea
              id="goal"
              name="goal"
              required
              rows={5}
              className="mt-2 w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus-visible:border-primary"
              placeholder="VD: Tôi bán hàng online và muốn dùng AI để tự viết nội dung, trả lời khách và theo dõi đơn."
            />
            <span className="mt-4 block text-sm font-semibold">Trình độ hiện tại</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {levels.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLevel(item)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    level === item
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary-soft text-primary hover:bg-primary/15"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <Button type="submit" variant="conversion" size="xl" className="mt-6 w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Đang tạo lộ trình...
                </>
              ) : (
                <>
                  <Sparkles /> Tạo lộ trình cho tôi
                </>
              )}
            </Button>
            {error ? (
              <p className="mt-3 text-sm font-medium text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </form>

          <div className="min-h-64 rounded-lg border border-dashed border-border bg-surface p-6">
            {path ? (
              <div>
                <p className="text-base font-semibold">{path.summary}</p>
                <ol className="mt-6 space-y-5">
                  {path.weeks.map((week, index) => (
                    <li key={week.title} className="border-l-2 border-primary/40 pl-4">
                      <span className="text-xs font-bold uppercase text-primary">Tuần {index + 1}</span>
                      <h3 className="mt-1 text-lg font-bold">{week.title}</h3>
                      <p className="text-sm text-muted-foreground">{week.focus}</p>
                      <ul className="mt-2 space-y-1 text-sm">
                        {week.actions.map((action) => (
                          <li key={action} className="flex gap-2">
                            <span className="text-primary">•</span> {action}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 flex items-start gap-2 rounded-md bg-primary-soft p-4 text-sm font-medium text-primary">
                  <Target className="mt-0.5 size-4 shrink-0" /> Bắt đầu ngay: {path.firstStep}
                </p>
              </div>
            ) : (
              <p className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                {loading ? "AI đang xây lộ trình phù hợp với mục tiêu của bạn..." : "Lộ trình của bạn sẽ hiển thị tại đây."}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
