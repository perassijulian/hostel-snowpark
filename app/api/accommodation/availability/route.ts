import { handleAvailability } from "@/lib/handlers/accommodation";

export async function GET(req: Request) {
  return await handleAvailability(req);
}
