import axios from 'axios';

export interface Discovery {
  status: string;
}

export const getStatus = async (
  uuid: string,
  projectId: string,
  options: { baseUrl: string; token: string }
): Promise<Discovery | never> => {
  const res = await axios.get<Discovery>(
    `${options.baseUrl}/api/v2/projects/${projectId}/discoveries/${uuid}`,
    {
      headers: { authorization: `api-key ${options.token}` }
    }
  );

  const { data } = res;

  return data;
};

export const stopDiscovery = async (
  uuid: string,
  projectId: string,
  options: { baseUrl: string; token: string }
): Promise<void> => {
  try {
    await axios.post<void>(
      `${options.baseUrl}/api/v2/projects/${projectId}/discoveries/${uuid}/lifecycle`,
      { action: 'stop' },
      {
        headers: { authorization: `api-key ${options.token}` }
      }
    );
  } catch {
    // noop
  }
};
