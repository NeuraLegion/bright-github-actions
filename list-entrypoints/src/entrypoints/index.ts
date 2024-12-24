import { getInput, setOutput, setFailed } from '@actions/core';
import { HttpClient } from '@actions/http-client';

interface EntrypointResponse {
  nextId?: string;
  nextCreatedAt?: string;
  items: Array<{
    id: string;
    name: string;
    url: string;
  }>;
}

async function run(): Promise<void> {
  try {
    const apiToken = getInput('api_token', { required: true });
    const hostname = getInput('hostname');
    const projectId = getInput('project_id', { required: true });
    const limit = getInput('limit');

    const baseUrl = hostname || 'https://app.brightsec.com';
    const client = new HttpClient('GitHub Actions', undefined, {
      headers: {
        Authorization: `api-key ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    const entrypoints: Array<{
      id: string;
      name: string;
      url: string;
    }> = [];

    let nextId: string | undefined;
    let nextCreatedAt: string | undefined;

    do {
      const params = new URLSearchParams();
      params.append('projectId', projectId);
      if (limit) {
        params.append('limit', limit);
      }
      if (nextId) {
        params.append('nextId', nextId);
      }
      if (nextCreatedAt) {
        params.append('nextCreatedAt', nextCreatedAt);
      }

      const response = await client.get(
        `${baseUrl}/api/v1/entrypoints?${params.toString()}`
      );

      const responseBody = await response.readBody();
      const data = JSON.parse(responseBody) as EntrypointResponse;

      entrypoints.push(...data.items);

      nextId = data.nextId;
      nextCreatedAt = data.nextCreatedAt;
    } while (nextId && nextCreatedAt);

    setOutput('entrypoints', JSON.stringify(entrypoints));
    setOutput('projectId', projectId);
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      setFailed('An unknown error occurred');
    }
  }
}

void run();
