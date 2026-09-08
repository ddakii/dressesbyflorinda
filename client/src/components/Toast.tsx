import { useUiStore } from '@/lib/stores'

export function Toast() {
  const toast = useUiStore((s) => s.toast)
  if (!toast) return null

  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 bg-ink px-5 py-3 text-[11px] tracking-[0.18em] text-ivory uppercase animate-fade-in"
    >
      {toast}
    </div>
  )
}
