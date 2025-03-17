import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const HttpClient = {
  get: async (url: string) => {
    const response = await fetch(url);
    return response.json();
  },
  post: async (url: string, body: any) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  },
};

export { QueryClientProvider, queryClient };