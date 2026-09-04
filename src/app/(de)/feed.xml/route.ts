import { buildFeed } from "@/lib/feed";
import { feedResponse } from "@/lib/feed-response";

// Der Feed ändert sich nur beim Deploy, also einmal beim Bauen erzeugen.
export const dynamic = "force-static";

export function GET(): Response {
  return feedResponse(buildFeed("de"));
}
