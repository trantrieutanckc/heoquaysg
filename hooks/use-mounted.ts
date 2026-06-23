// [UNUSED] Hook dùng bởi toc.tsx (đã unused). Có thể xóa.
import * as React from "react"

export function useMounted() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
