const AIRTABLE_API_BASE = "https://api.airtable.com/v0";

const DEFAULT_POLL_ID = process.env.POLL_ID || "default-poll";

const DEFAULT_POLL = {
  question: "What's your favorite frontend framework?",
  options: [
    { id: "a", label: "React", colorTheme: "sky" },
    { id: "b", label: "Vue", colorTheme: "emerald" },
    { id: "c", label: "Angular", colorTheme: "red" },
    { id: "d", label: "Svelte", colorTheme: "orange" },
  ],
};

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function getConfig() {
  return {
    apiKey: requireEnv("AIRTABLE_API_KEY"),
    baseId: requireEnv("AIRTABLE_BASE_ID"),
    pollsTable: process.env.AIRTABLE_POLLS_TABLE || "polls",
    votesTable: process.env.AIRTABLE_VOTES_TABLE || "votes",
    pollId: DEFAULT_POLL_ID,
  };
}

function buildUrl(baseId, table, searchParams) {
  const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(table)}`);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

async function airtableRequest({ method = "GET", table, body, params }) {
  const { apiKey, baseId } = getConfig();
  const response = await fetch(buildUrl(baseId, table, params), {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Airtable ${method} ${table} failed: ${response.status} ${text}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

function mapOption(option, index) {
  return {
    id: option.id || `option-${index + 1}`,
    label: typeof option.label === "string" && option.label.trim() ? option.label.trim() : `Option ${index + 1}`,
    colorTheme: option.colorTheme || "sky",
  };
}

function normalizeConfig(question, options) {
  const normalizedOptions = Array.isArray(options) ? options.map(mapOption) : DEFAULT_POLL.options;
  const uniqueOptions = [];
  const seen = new Set();

  for (const option of normalizedOptions) {
    if (!seen.has(option.id)) {
      uniqueOptions.push(option);
      seen.add(option.id);
    }
  }

  return {
    question: typeof question === "string" && question.trim() ? question.trim() : DEFAULT_POLL.question,
    options: uniqueOptions.length >= 2 ? uniqueOptions : DEFAULT_POLL.options,
  };
}

function parsePollConfig(record) {
  if (!record) {
    return normalizeConfig(DEFAULT_POLL.question, DEFAULT_POLL.options);
  }

  const fields = record.fields || {};
  let parsedOptions = DEFAULT_POLL.options;

  if (typeof fields.options_json === "string" && fields.options_json.trim()) {
    try {
      parsedOptions = JSON.parse(fields.options_json);
    } catch {
      parsedOptions = DEFAULT_POLL.options;
    }
  }

  return normalizeConfig(fields.question, parsedOptions);
}

export async function getPollRecord(pollId = DEFAULT_POLL_ID) {
  const { pollsTable } = getConfig();
  const result = await airtableRequest({
    table: pollsTable,
    params: {
      maxRecords: 1,
      filterByFormula: `{poll_id}='${pollId.replace(/'/g, "\\'")}'`,
    },
  });

  return result.records?.[0] || null;
}

export async function getPollConfig(pollId = DEFAULT_POLL_ID) {
  const record = await getPollRecord(pollId);
  return parsePollConfig(record);
}

export async function upsertPollConfig({ pollId = DEFAULT_POLL_ID, question, options }) {
  const { pollsTable } = getConfig();
  const normalized = normalizeConfig(question, options);
  const existing = await getPollRecord(pollId);

  const fields = {
    poll_id: pollId,
    question: normalized.question,
    options_json: JSON.stringify(normalized.options),
  };

  if (existing) {
    await airtableRequest({
      method: "PATCH",
      table: pollsTable,
      body: {
        records: [{ id: existing.id, fields }],
      },
    });
  } else {
    await airtableRequest({
      method: "POST",
      table: pollsTable,
      body: {
        records: [{ fields }],
      },
    });
  }

  return normalized;
}

async function fetchVoteRecords(pollId) {
  const { votesTable } = getConfig();
  const allRecords = [];
  let offset;

  do {
    const data = await airtableRequest({
      table: votesTable,
      params: {
        pageSize: 100,
        offset,
        filterByFormula: `{poll_id}='${pollId.replace(/'/g, "\\'")}'`,
      },
    });

    allRecords.push(...(data.records || []));
    offset = data.offset;
  } while (offset);

  return allRecords;
}

export async function getVoteCounts(pollId = DEFAULT_POLL_ID) {
  const records = await fetchVoteRecords(pollId);
  const counts = new Map();

  for (const record of records) {
    const optionId = record.fields?.option_id;
    if (!optionId) continue;
    counts.set(optionId, (counts.get(optionId) || 0) + 1);
  }

  return counts;
}

export async function getPollState(pollId = DEFAULT_POLL_ID) {
  const [config, voteCounts] = await Promise.all([
    getPollConfig(pollId),
    getVoteCounts(pollId),
  ]);

  return {
    pollId,
    question: config.question,
    options: config.options.map((option) => ({
      ...option,
      votes: voteCounts.get(option.id) || 0,
    })),
  };
}

export async function hasVoterVoted({ pollId = DEFAULT_POLL_ID, voterId }) {
  if (!voterId) return false;
  const { votesTable } = getConfig();
  const result = await airtableRequest({
    table: votesTable,
    params: {
      maxRecords: 1,
      filterByFormula: `AND({poll_id}='${pollId.replace(/'/g, "\\'")}',{voter_id}='${voterId.replace(/'/g, "\\'")}')`,
    },
  });
  return Boolean(result.records?.length);
}

export async function createVote({ pollId = DEFAULT_POLL_ID, optionId, voterId, voteId }) {
  const { votesTable } = getConfig();
  await airtableRequest({
    method: "POST",
    table: votesTable,
    body: {
      records: [
        {
          fields: {
            vote_id: voteId,
            poll_id: pollId,
            option_id: optionId,
            voter_id: voterId,
            created_at: new Date().toISOString(),
          },
        },
      ],
    },
  });
}

export async function resetVotes(pollId = DEFAULT_POLL_ID) {
  const { apiKey, baseId, votesTable } = getConfig();
  const records = await fetchVoteRecords(pollId);
  const ids = records.map((record) => record.id);

  for (let i = 0; i < ids.length; i += 10) {
    const batch = ids.slice(i, i + 10);
    const url = new URL(buildUrl(baseId, votesTable));
    for (const id of batch) {
      url.searchParams.append("records[]", id);
    }

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Airtable DELETE ${votesTable} failed: ${response.status} ${text}`);
    }
  }
}

export function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

export function getDefaultPollId() {
  return DEFAULT_POLL_ID;
}
