import { useI18n } from '@/lib/i18n'

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale, t } = useI18n()

  return (
    <div className={`flex items-center gap-2 text-[11px] tracking-[0.18em] ${className}`} role="group" aria-label={t('common.language')}>
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={locale === 'en' ? 'text-ink' : 'text-muted hover:text-ink'}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
      <span className="text-taupe" aria-hidden>
        |
      </span>
      <button
        type="button"
        onClick={() => setLocale('sq')}
        className={locale === 'sq' ? 'text-ink' : 'text-muted hover:text-ink'}
        aria-pressed={locale === 'sq'}
      >
        SQ
      </button>
    </div>
  )
}
