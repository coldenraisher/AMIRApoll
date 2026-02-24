import { getDefaultPollId, getPollState, json, resetVotes } from "./_lib/poll-store.js";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const pollId = body.pollId || getDefaultPollId();
    await resetVotes(pollId);
    const state = await getPollState(pollId);
    return json(200, { ok: true, state });
  } catch (error) {
    return json(500, {
      error: "Failed to reset votes",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
