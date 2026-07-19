import * as React from "react"

const MESSAGES = [
  "Đang hỏi heo...",
  "Đang quay heo...",
  "Heo đang suy nghĩ...",
  "Chờ xíu nha...",
  "Sắp ra lò rồi...",
]

export function useFunnyLoading(active: boolean, interval = 400) {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    if (!active) return
    setIndex(0)
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), interval)
    return () => clearInterval(id)
  }, [active, interval])

  return MESSAGES[index]
}
