export interface Quote {
  id: number;
  quote: string;
  author: string | null;
  guildId: string;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: number;
  url: string;
  filename: string | null;
  tag: string | null;
  guildId: string;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = '/api';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

export const fetchQuotes = () => request<Quote[]>('/quotes');

export const fetchImages = (server?: string) => {
  const query = server ? `?server=${encodeURIComponent(server)}` : '';
  return request<Image[]>(`/images${query}`);
};

export const imageSrc = (image: Image) =>
  image.filename ? `/images/${image.filename}` : image.url;
