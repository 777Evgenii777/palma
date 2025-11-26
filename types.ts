export interface Birthday {
  id: string;
  name: string;
  date: string; // ISO Date string YYYY-MM-DD
  relationship: string;
  phoneNumber?: string;
}

export interface WishGeneratorParams {
  name: string;
  age: number;
  relationship: string;
  tone?: 'funny' | 'sincere' | 'mafia' | 'cool';
}

export interface GeneratedWishResponse {
  wish: string;
  giftIdeas: string[];
}