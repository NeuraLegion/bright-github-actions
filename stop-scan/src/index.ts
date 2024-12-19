import * as core from '@actions/core';
import * as rm from 'typed-rest-client/RestClient';

const apiToken = core.getInput('api_token');
const scanId = core.getInput('scan');
const hostname = core.getInput('hostname');

const baseUrl = hostname
  ? `https://${hostname}`
  : 'https://app.neuralegion.com';
const restc = new rm.RestClient('GitHub Actions', baseUrl);

async function stopScan(uuid: string) {
  try {
    const options = {
      additionalHeaders: { Authorization: `Api-Key ${apiToken}` }
    };
    const restRes = await restc.get(`api/v1/scans/${uuid}/stop`, options);
    core.info(`Was succesfully stopped. Code ${restRes.statusCode}.`);
  } catch (err: any) {
    core.setFailed(`Failed (${err.statusCode}) ${err.message}`);
  }
}

stopScan(scanId);
