const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface ProductInput {
  product_name: string;
  description: string;
  target_audience?: string;
  key_features?: string;
  website_url?: string;
  language: string;
}

export interface MarketingContent {
  twitter_posts: string[];
  linkedin_post: string;
  reddit_post: {
    title: string;
    body: string;
    best_subreddits: string[];
  };
  product_hunt: {
    tagline: string;
    description: string;
    first_comment: string;
  };
  email_templates: Array<{
    subject: string;
    body: string;
    angle: string;
  }>;
  launch_checklist: string[];
}

export async function generateMarketingContent(input: ProductInput): Promise<MarketingContent> {
  const response = await fetch(`${API_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    // Handle both string and object detail formats
    const errorMessage = typeof data.detail === 'string'
      ? data.detail
      : data.detail?.error || data.detail?.message || 'Failed to generate content';
    throw new Error(errorMessage);
  }

  return response.json();
}
