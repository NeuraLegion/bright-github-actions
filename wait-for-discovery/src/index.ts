import * as core from '@actions/core';
import axios from 'axios';
import axiosRetry from 'axios-retry';

import { AsyncData, asyncPoll } from './async-poller';
import { Discovery, getStatus, stopDiscovery } from './discovery';

const token = core.getInput('api_token', { required: true });
const discoveryId = core.getInput('discovery_id', { required: true });
const projectId = core.getInput('project_id', { required: true });
const hostname = core.getInput('hostname');

const interval = 20000;
const timeout = 1000 * Number(core.getInput('timeout'));

const baseUrl = (
  hostname ? `https://${hostname}` : 'https://app.brightsec.com'
).replace(/\/$/, '');

axiosRetry(axios, { retries: 3 });

const getDiscoveryStatus = async (
  uuid: string,
  discProjectId: string
): Promise<Discovery | never> => {
  try {
    return await getStatus(uuid, discProjectId, {
      baseUrl,
      token
    });
  } catch (err: any) {
    core.debug(err);
    const message = `Failed to retrieve the actual status.`;
    core.setFailed(message);
    throw new Error(message);
  }
};

asyncPoll(
  async (): Promise<AsyncData<any>> => {
    const state = await getDiscoveryStatus(discoveryId, projectId);

    const terminalStates = ['failed', 'stopped', 'complete'];

    return {
      done: terminalStates.includes(state.status),
      data: state.status
    };
  },
  interval,
  timeout
).catch(async (e: any) => {
  await stopDiscovery(discoveryId, projectId, {
    baseUrl,
    token
  });
  core.debug(e);
  core.setFailed(e);
});
