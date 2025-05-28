// マーケティング戦略カテゴリーのデータ

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image: string;
}

export interface PopularArticle {
  id: number;
  title: string;
  image: string;
}

export interface Category {
  name: string;
  count: number;
  active: boolean;
}

// 記事データ
export const articles: Article[] = [
  {
    id: 1,
    title:
      '後発のBtoBメディアがコンテンツSEOで勝ち切るために必要だった10のこと',
    excerpt:
      'BtoBメディアでコンテンツSEOを成功させるための具体的な戦略と実践方法について解説します。',
    date: '2025-04-01',
    author: '田島 光太郎',
    category: 'マーケティング戦略',
    image: '/images/marketing/content-strategy-meeting-101.webp',
  },
  {
    id: 2,
    title: 'マーケティングROIを2倍にする実践テクニック',
    excerpt:
      '効果的なマーケティング投資と測定方法について、具体的な事例を交えて解説します。',
    date: '2025-03-15',
    author: '田島 光太郎',
    category: 'マーケティング戦略',
    image: '/images/marketing/roi-analysis-102.webp',
  },
  {
    id: 3,
    title: 'BtoBリードジェネレーション完全ガイド',
    excerpt:
      '効果的なリード獲得から育成まで、BtoB企業のための包括的な戦略を解説します。',
    date: '2025-02-28',
    author: '田島 光太郎',
    category: 'マーケティング戦略',
    image: '/images/marketing/lead-generation-103.webp',
  },
  {
    id: 4,
    title: 'コンテンツマーケティングの効果を最大化する方法',
    excerpt:
      'コンテンツマーケティングの戦略立案から実行、効果測定までを体系的に解説します。',
    date: '2025-02-15',
    author: '佐藤 健太',
    category: 'マーケティング戦略',
    image: '/images/marketing/content-calendar-104.webp',
  },
  {
    id: 5,
    title: 'Instagram広告完全攻略ガイド2025',
    excerpt:
      '最新のInstagram広告機能と効果的な活用方法について詳しく解説します。',
    date: '2025-02-01',
    author: '鈴木 美咲',
    category: 'マーケティング戦略',
    image: '/images/marketing/social-media-105.webp',
  },
  {
    id: 6,
    title: '失敗しないコンテンツマーケティング入門',
    excerpt:
      '初めてコンテンツマーケティングに取り組む企業のための実践的なガイドです。',
    date: '2025-01-20',
    author: '山田 太郎',
    category: 'マーケティング戦略',
    image: '/images/marketing/content-planning-106.webp',
  },
  {
    id: 7,
    title: 'BtoBマーケティングの最新トレンド2025',
    excerpt:
      '2025年に注目すべきBtoBマーケティングの最新トレンドと実践方法を紹介します。',
    date: '2025-01-10',
    author: '田島 光太郎',
    category: 'マーケティング戦略',
    image: '/images/marketing/b2b-trends-107.webp',
  },
  {
    id: 8,
    title: 'メールマーケティングで実現した開封率40%の施策',
    excerpt:
      '実際に開封率40%を達成したメールマーケティングの具体的な施策と実践方法を解説します。',
    date: '2024-12-25',
    author: '佐藤 健太',
    category: 'マーケティング戦略',
    image: '/images/marketing/email-campaign-108.webp',
  },
  {
    id: 9,
    title: 'データドリブンマーケティングの実践ガイド',
    excerpt:
      'データを活用した効果的なマーケティング戦略の立案と実行方法について解説します。',
    date: '2024-12-15',
    author: '鈴木 美咲',
    category: 'マーケティング戦略',
    image: '/images/marketing/data-driven-109.webp',
  },
  {
    id: 10,
    title: 'マーケティングオートメーション導入の完全ガイド',
    excerpt:
      'マーケティングオートメーションの選定から導入、活用までを詳しく解説します。',
    date: '2024-12-05',
    author: '山田 太郎',
    category: 'マーケティング戦略',
    image: '/images/marketing/automation-110.webp',
  },
  {
    id: 11,
    title: 'ABMマーケティングの戦略と実践',
    excerpt:
      'アカウントベースドマーケティングの戦略立案から実行までを事例を交えて解説します。',
    date: '2024-11-25',
    author: '田島 光太郎',
    category: 'マーケティング戦略',
    image: '/images/marketing/abm-strategy-111.webp',
  },
  {
    id: 12,
    title: 'BtoBコンテンツマーケティングの成功事例',
    excerpt:
      '実際に成功したBtoB企業のコンテンツマーケティング事例と成功要因を分析します。',
    date: '2024-11-15',
    author: '佐藤 健太',
    category: 'マーケティング戦略',
    image: '/images/marketing/b2b-content-112.webp',
  },
];

// 人気記事データ
export const popularArticles: PopularArticle[] = [
  {
    id: 2,
    title: 'マーケティングROIを2倍にする実践テクニック',
    image: '/images/marketing/roi-dashboard-201.webp',
  },
  {
    id: 5,
    title: 'Instagram広告完全攻略ガイド2025',
    image: '/images/marketing/instagram-campaign-202.webp',
  },
  {
    id: 6,
    title: '失敗しないコンテンツマーケティング入門',
    image: '/images/marketing/content-planning-203.webp',
  },
  {
    id: 8,
    title: 'メールマーケティングで実現した開封率40%の施策',
    image: '/images/marketing/email-analysis-204.webp',
  },
];

// カテゴリーデータ
export const categories: Category[] = [
  { name: 'マーケティング戦略', count: 15, active: true },
  { name: 'コンテンツ戦略', count: 12, active: false },
  { name: 'SNSマーケティング', count: 8, active: false },
  { name: 'SEO対策', count: 10, active: false },
  { name: 'リードジェネレーション', count: 7, active: false },
  { name: 'メール戦略', count: 6, active: false },
];
