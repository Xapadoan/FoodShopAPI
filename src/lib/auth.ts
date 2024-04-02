import { ServerClient } from '@authservice/server';

let client: ServerClient;
(async () => {
  client = await ServerClient.init();
})();

const getClient = () => {
  if (client) return client;
  throw new Error('No Auth Client Yet');
};

export default getClient;
