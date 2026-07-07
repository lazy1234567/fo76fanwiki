export type ArticleStatus = 'ai_draft' | 'needs_review' | 'verified' | 'rejected';

export type ArticleCategory =
  | 'items'
  | 'weapons'
  | 'armor'
  | 'quests'
  | 'locations'
  | 'creatures'
  | 'builds'
  | 'lore'
  | 'perks'
  | 'events';

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: ArticleCategory;
  content: string;
  status: ArticleStatus;
  created_at: string;
  updated_at: string;
  ai_generated: boolean;
  flag_count: number;
  view_count: number;
}

export interface Flag {
  id: string;
  article_id: string;
  reason: string;
  detail?: string;
  created_at: string;
  resolved: boolean;
}

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  items: 'Items',
  weapons: 'Weapons',
  armor: 'Armor',
  quests: 'Quests',
  locations: 'Locations',
  creatures: 'Creatures',
  builds: 'Builds',
  lore: 'Lore',
  perks: 'Perks',
  events: 'Events',
};

export const CATEGORY_ICONS: Record<ArticleCategory, string> = {
  items: '📦',
  weapons: '🔫',
  armor: '🛡️',
  quests: '📋',
  locations: '📍',
  creatures: '☢️',
  builds: '⚙️',
  lore: '📖',
  perks: '⭐',
  events: '🎯',
};
