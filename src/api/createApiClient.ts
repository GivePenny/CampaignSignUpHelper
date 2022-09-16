import axios from "axios";
import axiosRetry from "axios-retry";

export default function createApiClient(baseUrl: string) {
  const client = axios.create({ baseURL: baseUrl });

  axiosRetry(client, { retries: 3, retryDelay: () => 500 });

  return client;
}
