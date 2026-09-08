import { useEffect } from 'react'
import { fetchMe, syncWishlist } from '@/lib/api'
import { useAuthStore, useWishlistStore } from '@/lib/stores'

export function AuthHydrate() {
  const setUser = useAuthStore((s) => s.setUser)
  const setIds = useWishlistStore((s) => s.setIds)

  useEffect(() => {
    void fetchMe()
      .then((data) => {
        if (!data?.user) return
        setUser(data.user)
        const localIds = useWishlistStore.getState().ids
        return syncWishlist(localIds).then((res) => {
          if (res?.ids) setIds(res.ids)
        })
      })
      .catch(() => undefined)
  }, [setUser, setIds])

  return null
}
