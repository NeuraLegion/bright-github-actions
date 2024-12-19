import * as core from '@actions/core';
import { HttpClient } from '@actions/http-client';

const apiToken = core.getInput('api_token');
const discoveryId = core.getInput('discovery_id');
const projectId = core.getInput('project_id');
const hostname = core.getInput('hostname');

const baseUrl = hostname ? `https://${hostname}` : 'https://app.brightsec.com';

const client = new HttpClient('GitHub Actions', [], {
  allowRetries: true,
  maxRetries: 5,
  headers: { authorization: `Api-Key ${apiToken}` }
});

async function stopDiscovery(uuid: string) {
  try {
    const response = await client.putJson(
      `${baseUrl}/api/v2/projects/${projectId}/discoveries/${uuid}/lifecycle`,
      { action: 'stop' }
    );

    core.info(`Was successfully stopped. Code ${response.statusCode}.`);
  } catch (err: any) {
    core.setFailed(`Failed (${err.statusCode}) ${err.message}`);
  }
}

stopDiscovery(discoveryId);
