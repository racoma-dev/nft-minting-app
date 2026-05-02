import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Web3Modal } from "@/context/web3modal";
import { cn, getURL } from "@/lib/utils";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL(getURL()),
	title: { template: "%s | NFT Minting App", default: "NFT Minting App" },
	description: "様々な種類のNFTをミントできます。",
};

config.autoAddCss = false;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja" suppressHydrationWarning>
			<body className={cn(inter.className, "min-h-dvh")}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Web3Modal>
						<Header />
						<main>{children}</main>
						<Footer />
					</Web3Modal>
				</ThemeProvider>
			</body>
		</html>
	);
}
