import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateMarketingContent } from '../lib/api';

describe('API', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('handles string error detail', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ detail: 'Something went wrong' }),
    });

    await expect(
      generateMarketingContent({
        product_name: 'test',
        description: 'test',
        language: 'en',
      })
    ).rejects.toThrow('Something went wrong');
  });

  it('handles object error detail with error field', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 402,
      json: () =>
        Promise.resolve({
          detail: { error: 'No tokens remaining', code: 'payment_required' },
        }),
    });

    await expect(
      generateMarketingContent({
        product_name: 'test',
        description: 'test',
        language: 'en',
      })
    ).rejects.toThrow('No tokens remaining');
  });

  it('handles object error detail with message field', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () =>
        Promise.resolve({
          detail: { message: 'Invalid input' },
        }),
    });

    await expect(
      generateMarketingContent({
        product_name: 'test',
        description: 'test',
        language: 'en',
      })
    ).rejects.toThrow('Invalid input');
  });

  it('never throws [object Object]', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () =>
        Promise.resolve({
          detail: { foo: 'bar' }, // Object without error or message
        }),
    });

    try {
      await generateMarketingContent({
        product_name: 'test',
        description: 'test',
        language: 'en',
      });
    } catch (e) {
      expect((e as Error).message).not.toContain('[object Object]');
      expect((e as Error).message).not.toContain('object Object');
    }
  });

  it('successfully returns content on 200', async () => {
    const mockContent = {
      twitter_posts: ['Tweet 1'],
      linkedin_post: 'LinkedIn',
      reddit_post: { title: 'Title', body: 'Body', best_subreddits: [] },
      product_hunt: { tagline: 'Tag', description: 'Desc', first_comment: 'Comment' },
      email_templates: [],
      launch_checklist: [],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockContent),
    });

    const result = await generateMarketingContent({
      product_name: 'test',
      description: 'test',
      language: 'en',
    });

    expect(result).toEqual(mockContent);
  });
});
