import { $API_URL } from '../plugins/vite_env';

export const fetchAPI = async <T extends keyof Endpoints>(
  endpoints: T,
  body: Endpoints[T]['req'],
  method: 'POST' | 'GET' = 'POST'
): Promise<Endpoints[T]['res'] | undefined> => {
  return fetch(`${$API_URL}/api/${endpoints}`, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
    .then(response => (response.ok ? response.json() : undefined))
    .then(data => data)
    .catch(_ => undefined);
};
