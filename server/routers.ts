import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { buildAgentRun, buildDebate, buildHunter, clampPosition, clampRisk, defaultPositionCap, defaultRiskLimit, getDemoSnapshot, getNarratives } from "./marketEngine";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  market: router({
    snapshot: publicProcedure.query(() => getDemoSnapshot()),
    narratives: publicProcedure.query(() => getNarratives()),
    run: publicProcedure
      .input(z.object({ riskLimit: z.number().optional(), maxPositionPct: z.number().optional(), narrative: z.string().optional() }).optional())
      .mutation(({ input }) => buildAgentRun(clampRisk(input?.riskLimit ?? defaultRiskLimit), clampPosition(input?.maxPositionPct ?? defaultPositionCap), input?.narrative)),
    debate: publicProcedure
      .input(z.object({ topic: z.string().optional() }).optional())
      .mutation(({ input }) => buildDebate(input?.topic)),
    hunter: publicProcedure.mutation(() => buildHunter()),
    config: publicProcedure.query(() => ({ defaultRiskLimit, defaultPositionCap, maxSources: 20, mode: "paper-only" as const })),
  }),
});

export type AppRouter = typeof appRouter;
