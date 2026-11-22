import { issueFormToken, json } from "@/lib/security";

export const dynamic = "force-dynamic";

/** Issues a short-lived signed token; forms must hold it for a few seconds before submitting. */
export async function GET() {
  return json({ token: issueFormToken() });
}
