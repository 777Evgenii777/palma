export interface Birthday {
  id: string;
  name: string;
  date: string; // ISO Date string YYYY-MM-DD
  relationship: string;
  phoneNumber?: string;
  avatar?: string;      // Ссылка на фото
  expiryDate?: string;  // Дата окончания срока (YYYY-MM-DD)
}

export interface WishGeneratorParams {
  name: string;
  age: number;
  relationship: string;
  tone?: 'funny' | 'sincere' | 'mafia' | 'cool';
  daysUntilExpiry?: number; // Опционально для контекста поздравления
}

export interface GeneratedWishResponse {
  wish: string;
  giftIdeas: string[];
}