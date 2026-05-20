import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().default(""),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Missing or invalid environment variables:");
  console.error(_env.error.format());
  throw new Error("Invalid environment configuration. App cannot start.");
}

export const URL_BASE: string = _env.data.NEXT_PUBLIC_API_URL;
