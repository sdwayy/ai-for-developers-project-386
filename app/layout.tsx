import "@mantine/core/styles.css";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import type { ReactNode } from "react";
import { Providers } from "@/_app/providers";

export const metadata = {
  title: "Calendar",
  description: "Сервис записи на звонки",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
