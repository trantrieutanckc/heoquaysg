import type { Metadata } from "next"

export const faviconMetadata: Metadata["icons"] = {
  icon: [
    { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/favicons/favicon.ico", type: "image/x-icon" },
    { url: "/favicons/favicon.svg", type: "image/svg+xml" },
  ],
  shortcut: "/favicons/favicon.ico",
  apple: "/favicons/apple-touch-icon.png",
}
