import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Rocket, Twitter, Linkedin, MessageCircle, Mail, CheckSquare, AlertCircle, Loader2 } from 'lucide-react';
import LanguageSwitcher from './components/LanguageSwitcher';
import ContentCard from './components/ContentCard';
import { generateMarketingContent, MarketingContent } from './lib/api';

function App() {
  const { t } = useTranslation();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyFeatures, setKeyFeatures] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [contentLanguage, setContentLanguage] = useState<'en' | 'zh'>('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<MarketingContent | null>(null);
  const [activeTab, setActiveTab] = useState<string>('twitter');

  const handleGenerate = async () => {
    if (!productName || !description) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await generateMarketingContent({
        product_name: productName,
        description,
        target_audience: targetAudience || undefined,
        key_features: keyFeatures || undefined,
        website_url: websiteUrl || undefined,
        language: contentLanguage,
      });
      setContent(result);
      setActiveTab('twitter');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'twitter', label: t('twitter'), icon: Twitter },
    { id: 'linkedin', label: t('linkedin'), icon: Linkedin },
    { id: 'reddit', label: t('reddit'), icon: MessageCircle },
    { id: 'producthunt', label: t('productHunt'), icon: Rocket },
    { id: 'email', label: t('email'), icon: Mail },
    { id: 'checklist', label: t('checklist'), icon: CheckSquare },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-12">
        <div className="flex justify-between items-start mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
              <Terminal className="w-7 h-7 text-[var(--color-bg)]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                {t('title')}
              </h1>
              <p className="text-[var(--color-text-muted)] text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
                {t('subtitle')}
              </p>
            </div>
          </motion.div>
          <LanguageSwitcher />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-[var(--color-accent)] font-semibold"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t('tagline')}
        </motion.p>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6"
          >
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                  {t('productName')} *
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder={t('productNamePlaceholder')}
                  className="w-full"
                  data-testid="product-name-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                  {t('description')} *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('descriptionPlaceholder')}
                  rows={4}
                  className="w-full resize-none"
                  data-testid="description-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                  {t('targetAudience')}
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder={t('targetAudiencePlaceholder')}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                  {t('keyFeatures')}
                </label>
                <textarea
                  value={keyFeatures}
                  onChange={(e) => setKeyFeatures(e.target.value)}
                  placeholder={t('keyFeaturesPlaceholder')}
                  rows={3}
                  className="w-full resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                  {t('websiteUrl')}
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder={t('websiteUrlPlaceholder')}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                  {t('contentLanguage')}
                </label>
                <select
                  value={contentLanguage}
                  onChange={(e) => setContentLanguage(e.target.value as 'en' | 'zh')}
                  className="w-full"
                  data-testid="content-language-select"
                >
                  <option value="en">{t('english')}</option>
                  <option value="zh">{t('chinese')}</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !productName || !description}
                className={`w-full py-4 px-6 text-lg font-bold rounded-lg transition-all ${
                  loading || !productName || !description
                    ? 'bg-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed'
                    : 'bg-[var(--color-accent)] text-[var(--color-bg)] hover:shadow-lg hover:shadow-[var(--color-accent-glow)] active:scale-[0.98]'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
                data-testid="generate-button"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('generating')}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Rocket className="w-5 h-5" />
                    {t('generate')}
                  </span>
                )}
              </button>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden min-h-[600px]"
          >
            {error && (
              <div className="p-4 bg-[var(--color-error)]/10 border-b border-[var(--color-error)]/30 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-[var(--color-error)]" />
                <span className="text-[var(--color-error)]">{error}</span>
              </div>
            )}

            {!content && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-muted)] p-8">
                <Terminal className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-center" style={{ fontFamily: 'var(--font-mono)' }}>
                  Fill in your product details and hit EXECUTE to generate marketing content.
                </p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center p-8">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-[var(--color-border)] rounded-full" />
                  <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-[var(--color-accent)] rounded-full animate-spin" />
                </div>
                <p className="mt-6 text-[var(--color-accent)]" style={{ fontFamily: 'var(--font-mono)' }}>
                  Generating marketing content<span className="cursor-blink"></span>
                </p>
              </div>
            )}

            {content && !loading && (
              <>
                {/* Tabs */}
                <div className="flex overflow-x-auto border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)] bg-[var(--color-surface)]'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]'
                      }`}
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6 max-h-[500px] overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {activeTab === 'twitter' && (
                      <motion.div
                        key="twitter"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        {content.twitter_posts.map((post, i) => (
                          <ContentCard key={i} content={post} label={`Tweet ${i + 1}`} />
                        ))}
                      </motion.div>
                    )}

                    {activeTab === 'linkedin' && (
                      <motion.div
                        key="linkedin"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <ContentCard content={content.linkedin_post} />
                      </motion.div>
                    )}

                    {activeTab === 'reddit' && (
                      <motion.div
                        key="reddit"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <ContentCard content={content.reddit_post.title} label="Title" />
                        <ContentCard content={content.reddit_post.body} label="Body" />
                        <div className="p-4 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)]">
                          <p className="text-sm text-[var(--color-text-muted)] mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                            {t('bestSubreddits')}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {content.reddit_post.best_subreddits.map((sub, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] rounded-full text-sm"
                                style={{ fontFamily: 'var(--font-mono)' }}
                              >
                                r/{sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'producthunt' && (
                      <motion.div
                        key="producthunt"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <ContentCard content={content.product_hunt.tagline} label={t('taglineLabel')} />
                        <ContentCard content={content.product_hunt.description} label={t('phDescription')} />
                        <ContentCard content={content.product_hunt.first_comment} label={t('firstComment')} />
                      </motion.div>
                    )}

                    {activeTab === 'email' && (
                      <motion.div
                        key="email"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        {content.email_templates.map((email, i) => (
                          <div key={i} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 bg-[var(--color-accent)]/20 text-[var(--color-accent)] rounded" style={{ fontFamily: 'var(--font-mono)' }}>
                                {email.angle}
                              </span>
                            </div>
                            <ContentCard content={email.subject} label={t('subject')} />
                            <ContentCard content={email.body} />
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {activeTab === 'checklist' && (
                      <motion.div
                        key="checklist"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3"
                      >
                        {content.launch_checklist.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-4 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)]"
                          >
                            <CheckSquare className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                            <span style={{ fontFamily: 'var(--font-body)' }}>{item}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-12 text-center text-[var(--color-text-muted)] text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
        {t('footer')}
      </footer>
    </div>
  );
}

export default App;
