import {
  createVote,
  getDefaultPollId,
  getPollConfig,
  getPollState,
  hasVoterVoted,
  json,
} from "./_lib/poll-store.js";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const pollId = body.pollId || getDefaultPollId();
    const optionId = typeof body.optionId === "string" ? body.optionId : "";
    const voterId = typeof body.voterId === "string" ? body.voterId : "";
    const voteId = typeof body.voteId === "string" ? body.voteId : crypto.randomUUID();

    if (!optionId) {
      return json(400, { error: "optionId is required" });
    }

    const config = await getPollConfig(pollId);
    const optionExists = config.options.some((option) => option.id === optionId);
    if (!optionExists) {
      return json(400, { error: "Invalid optionId" });
    }

    const alreadyVoted = await hasVoterVoted({ pollId, voterId });
    if (alreadyVoted) {
      const state = await getPollState(pollId);
      return json(409, { error: "Voter already submitted", state });
    }

    await createVote({ pollId, optionId, voterId, voteId });
    const state = await getPollState(pollId);
    return json(200, { ok: true, voteId, state });
  } catch (error) {
    return json(500, {
      error: "Failed to save vote",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
