import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { streamText, Output } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";

const RegistrationInput = z.object({
  fullName: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().min(6).max(30).optional(),
});

function serverSupabase() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const submitRegistration = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RegistrationInput.parse(input))
  .handler(async ({ data }) => {
    const supabase = serverSupabase();
    const { error } = await supabase.from("registrations").insert({
      full_name: data.fullName,
      email: data.email,
      phone: data.phone ?? null,
      status: "pending",
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const LearningPathInput = z.object({
  goal: z.string().min(10).max(1000),
  level: z.string().min(1).max(60),
  email: z.string().email().optional(),
});

const LearningPathSchema = z.object({
  summary: z.string(),
  weeks: z.array(
    z.object({
      title: z.string(),
      focus: z.string(),
      actions: z.array(z.string()),
    }),
  ),
  firstStep: z.string(),
});

export type LearningPath = z.infer<typeof LearningPathSchema>;

export const generateLearningPath = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LearningPathInput.parse(input))
  .handler(async ({ data }): Promise<LearningPath> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Thiếu cấu hình AI");

    const { createLovableAiGatewayRunIdFetch } = await import("./ai-gateway.server");
    const runIdFetch = createLovableAiGatewayRunIdFetch();
    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: runIdFetch.fetch,
    });

    const result = streamText({
      model: lovable.responses("openai/gpt-6-astra"),
      system:
        "Bạn là cố vấn học tập cho một workshop về xây dựng AI Agent. Trả lời hoàn toàn bằng tiếng Việt, cụ thể và thực tế. Tạo lộ trình 4 tuần, mỗi tuần 3-4 hành động ngắn gọn.",
      prompt: `Trình độ hiện tại: ${data.level}\nMục tiêu học tập: ${data.goal}`,
      output: Output.object({ schema: LearningPathSchema }),
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    const path = await result.output;

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("learning_paths").insert({
        goal: data.goal,
        level: data.level,
        email: data.email ?? null,
        content: path as never,
      });
    } catch (error) {
      console.warn("learning path not saved", error);
    }

    return path;
  });
