import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Mock the API module
vi.mock('../lib/api', () => ({
  generateMarketingContent: vi.fn(),
}));

import { generateMarketingContent } from '../lib/api';

const mockContent = {
  twitter_posts: ['Tweet 1', 'Tweet 2', 'Tweet 3', 'Tweet 4', 'Tweet 5'],
  linkedin_post: 'LinkedIn post content',
  reddit_post: {
    title: 'Reddit title',
    body: 'Reddit body',
    best_subreddits: ['startups', 'SaaS'],
  },
  product_hunt: {
    tagline: 'Tagline',
    description: 'Description',
    first_comment: 'First comment',
  },
  email_templates: [
    { subject: 'Subject 1', body: 'Body 1', angle: 'Value' },
    { subject: 'Subject 2', body: 'Body 2', angle: 'Partnership' },
    { subject: 'Subject 3', body: 'Body 3', angle: 'Press' },
  ],
  launch_checklist: ['Task 1', 'Task 2', 'Task 3'],
};

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (generateMarketingContent as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockContent);
  });

  it('renders the main title', () => {
    render(<App />);
    expect(screen.getByText('title')).toBeInTheDocument();
  });

  it('renders input form fields', () => {
    render(<App />);
    expect(screen.getByTestId('product-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('description-input')).toBeInTheDocument();
    expect(screen.getByTestId('content-language-select')).toBeInTheDocument();
  });

  it('disables generate button when required fields are empty', () => {
    render(<App />);
    const button = screen.getByTestId('generate-button');
    expect(button).toBeDisabled();
  });

  it('enables generate button when required fields are filled', () => {
    render(<App />);
    
    fireEvent.change(screen.getByTestId('product-name-input'), {
      target: { value: 'Test Product' },
    });
    fireEvent.change(screen.getByTestId('description-input'), {
      target: { value: 'Test description' },
    });

    const button = screen.getByTestId('generate-button');
    expect(button).not.toBeDisabled();
  });

  it('calls API when form is submitted', async () => {
    render(<App />);
    
    fireEvent.change(screen.getByTestId('product-name-input'), {
      target: { value: 'Test Product' },
    });
    fireEvent.change(screen.getByTestId('description-input'), {
      target: { value: 'Test description' },
    });
    
    fireEvent.click(screen.getByTestId('generate-button'));

    await waitFor(() => {
      expect(generateMarketingContent).toHaveBeenCalledWith({
        product_name: 'Test Product',
        description: 'Test description',
        target_audience: undefined,
        key_features: undefined,
        website_url: undefined,
        language: 'en',
      });
    });
  });

  it('displays generated content after successful API call', async () => {
    render(<App />);
    
    fireEvent.change(screen.getByTestId('product-name-input'), {
      target: { value: 'Test Product' },
    });
    fireEvent.change(screen.getByTestId('description-input'), {
      target: { value: 'Test description' },
    });
    
    fireEvent.click(screen.getByTestId('generate-button'));

    await waitFor(() => {
      expect(screen.getByText('Tweet 1')).toBeInTheDocument();
    });
  });

  it('displays error message on API failure', async () => {
    (generateMarketingContent as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('API Error')
    );

    render(<App />);
    
    fireEvent.change(screen.getByTestId('product-name-input'), {
      target: { value: 'Test Product' },
    });
    fireEvent.change(screen.getByTestId('description-input'), {
      target: { value: 'Test description' },
    });
    
    fireEvent.click(screen.getByTestId('generate-button'));

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  it('renders language switcher', () => {
    render(<App />);
    expect(screen.getByTestId('lang-switcher')).toBeInTheDocument();
  });
});
