import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import "@lib/util/local-storage-polyfill"
import Providers from "./providers"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="zh" data-mode="light">
      <body>
        <Providers>
          <main className="relative">{props.children}</main>
        </Providers>
      </body>
    </html>
  )
}
