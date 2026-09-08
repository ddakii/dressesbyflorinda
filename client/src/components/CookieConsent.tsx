import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n'

const KEY = 'florinda.cookies'

export function CookieConsent() {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(!window.localStorage.getItem(KEY))
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p className="text-sm text-muted">{t('cookie.text')}</p>
        <div className="flex gap-4 text-[11px] tracking-[0.18em] uppercase">
          <button
            type="button"
            onClick={() => {
              window.localStorage.setItem(KEY, 'essential')
              setVisible(false)
            }}
          >
            {t('cookie.decline')}
          </button>
          <button
            type="button"
            className="bg-ink px-5 py-2 text-ivory"
            onClick={() => {
              window.localStorage.setItem(KEY, 'all')
              setVisible(false)
            }}
          >
            {t('cookie.accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
