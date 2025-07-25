import { getBaseURL } from "@lib/util/env"
import LenisProvider from "context/LenisContext"
import { StateProvider } from "context/StateContext"
import { Metadata } from "next"
import "styles/globals.scss"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <StateProvider>
          <LenisProvider>
            <main className="relative">{props.children}</main>
          </LenisProvider>
        </StateProvider>
      </body>
    </html>
  )
}
