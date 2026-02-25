import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContentCardProps {
  content: string;
  label?: string;
}

export default function ContentCard({ content, label }: ContentCardProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="group relative p-4 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-colors">
      {label && (
        <p className="text-xs text-[var(--color-text-muted)] mb-2 uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>
          {label}
        </p>
      )}
      <p className="whitespace-pre-wrap text-[var(--color-text)]" style={{ fontFamily: 'var(--font-body)' }}>
        {content}
      </p>
      <motion.button
        onClick={handleCopy}
        className={`absolute top-3 right-3 p-2 rounded-lg transition-all ${
          copied
            ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
            : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 hover:text-[var(--color-accent)]'
        }`}
        whileTap={{ scale: 0.95 }}
        data-testid="copy-button"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </motion.button>
    </div>
  );
}
