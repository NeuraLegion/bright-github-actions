import { HttpClient } from "@actions/http-client";
import * as core from "@actions/core";

export interface ListEntryPoints {
  projectId: string;
  limit: number;
}

const apiToken = core.getInput("api_token", { required: true });
const hostname = core.getInput("hostname");
const projectId = core.getInput("project_id");
const limit = core.getInput("limit");

const baseUrl = hostname ? `https://${hostname}` : "https://app.brightsec.com";

const entrypointsPaginationBatchSize = 50;

const client = new HttpClient("GitHub Actions", [], {
  allowRetries: true,
  maxRetries: 5,
  headers: { authorization: `Api-Key ${apiToken}` },
});

export interface EntryPoint {
  id: string;
  method: string;
  url: string;
  responseStatus: number;
  connectivity: string;
  lastUpdated: string;
  lastEdited: string;
  lastValidated: string;
  parametersCount: number;
  responseTime: number;
  status: string;
  openIssuesCount: number;
  closedIssuesCount: number;
  createdAt: string;
}

async function listEntrypoints(config: ListEntryPoints): Promise<EntryPoint[]> {
  let remaining = config.limit;
  const data: EntryPoint[] = [];

  let nextId: string | undefined = undefined;
  let nextCreatedAt: string | undefined = undefined;

  while (remaining > 0) {
    const url = new URL(
      `${baseUrl}/api/v2/projects/${config.projectId}/entry-points`
    );

    url.searchParams.set(
      "limit",
      Math.min(remaining, entrypointsPaginationBatchSize).toString()
    );
    if (nextId !== undefined) {
      url.searchParams.set("nextId", nextId);
    }

    if (nextCreatedAt !== undefined) {
      url.searchParams.set("nextCreatedAt", nextCreatedAt);
    }

    const resp = await client.get(url.toString());

    const body = await resp.readBody();

    const dataItems : { items: EntryPoint[] } = JSON.parse(body);

    const items = dataItems.items;

    if (!items.length) {
      break;
    }

    data.push(...items);

    ({ id: nextId, createdAt: nextCreatedAt } = items[items.length - 1]);

    remaining -= entrypointsPaginationBatchSize;
  }

  return data;
}

core.setOutput(
  "entrypoints",
  listEntrypoints({ projectId, limit: Number(limit) })
);
core.setOutput("projectId", projectId);
