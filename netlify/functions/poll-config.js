import {
  getDefaultPollId,
  getPollState,
  json,
  upsertPollConfig,
} from "./_lib/poll-store.js";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const pollId = body.pollId || getDefaultPollId();
    const question = body.question;
    const options = body.options;

    if (!Array.isArray(options) || options.length < 2) {
      return json(400, { error: "At least 2 options are required" });
    }

    await upsertPollConfig({ pollId, question, options });
    const state = await getPollState(pollId);
    return json(200, { ok: true, state });
  } catch (error) {
    return json(500, {
      error: "Failed to update poll config",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
