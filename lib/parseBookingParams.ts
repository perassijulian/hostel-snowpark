import { z } from "zod";

const parseEmptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => (val === "" ? undefined : val), schema).optional();

const paramsSchema = z.object({
  checkIn: parseEmptyToUndefined(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  checkOut: parseEmptyToUndefined(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  guests: parseEmptyToUndefined(z.coerce.number().int().positive()),
  type: parseEmptyToUndefined(z.string()),
  id: parseEmptyToUndefined(z.string()),
});

export function parseBookingParams(searchParams: URLSearchParams) {
  const raw = Object.fromEntries(searchParams.entries());
  console.log("raw query params:", raw);

  const hasParams = Object.keys(raw).length > 0;

  if (!hasParams) return { hasParams: false, data: null };

  const parsed = paramsSchema.safeParse(raw);

  if (!parsed.success) {
    console.error("Zod validation failed:", parsed.error.format());
  }

  return {
    hasParams,
    data: parsed.success ? parsed.data : null,
  };
}
