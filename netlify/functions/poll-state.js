import { getDefaultPollId, getPollState, json } from "./_lib/poll-store.js";

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const pollId = event.queryStringParameters?.pollId || getDefaultPollId();
    const state = await getPollState(pollId);
    return json(200, state);
  } catch (error) {
    return json(500, {
      error: "Failed to load poll state",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
