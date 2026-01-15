import type { Metadata } from "next";
import { Roboto, Roboto_Condensed, Lora, Bitter } from "next/font/google";
import { cookies } from "next/headers";
import { clsx } from "clsx";
import "@styles/index.scss";
import { Container, MainContentContainer } from "@/components/layout/Container";
import { Sidebar } from "@/components/layout/Sidebar";

const roboto = Roboto({
  variable: "--ff-roboto",
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--ff-roboto-condensed",
  subsets: ["latin"],
});

const bitter = Bitter({
  variable: "--ff-bitter",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--ff-lora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kitchen Tools Dashboard",
  description: "A collection of tools to help with kitchen operations.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const collapsed =
    (await cookies()).get("sidebar-collapsed")?.value === "true";

  return (
    <html lang="en">
      <body
        className={clsx(
          roboto.variable,
          robotoCondensed.variable,
          bitter.variable,
          lora.variable
        )}
      >
        <Container>
          <Sidebar initialCollapsed={collapsed} />
          <MainContentContainer>{children}</MainContentContainer>
        </Container>
      </body>
    </html>
  );
}
