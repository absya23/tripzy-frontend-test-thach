import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, ThemeConfig } from "antd";
import Image from "next/image";
import Link from "next/link";
import './globals.css';

const nunitoSans = Nunito_Sans({
    variable: "--font-nunito-sans",
    subsets: ["latin"],
    display: "swap",
    weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
    title: "Tripzy travel",
    description: "Make every trip effortless. Tripzy lets you book rides and plan journeys with ease",
};

const customTheme: ThemeConfig = {
    token: {
        colorPrimary: "#19C0FF",
        borderRadius: 8,
        colorBorder: "#CCCFD5",
        fontFamily: "var(--font-nunito-sans)",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${nunitoSans.variable} antialiased`}
            >
                <div className="absolute left-0 top-0 -z-10 h-[500px] w-full bg-linear-to-b from-primary-100 to-primary-200" />
                <AntdRegistry>
                    <ConfigProvider theme={customTheme}>
                        <header className="absolute z-11 w-full top-4 left-0">
                            <div className="container max-w-7xl mx-auto flex content-between">
                                <div className="logo">
                                    <Link href="/">
                                        <Image width={126} height={40} src="icon.svg" alt="Logo"></Image>
                                    </Link>
                                </div>
                            </div>
                        </header>
                        <main className="container relative z-10 w-full px-4 pt-32 sm:px-8">
                            {children}
                        </main>
                    </ConfigProvider>
                </AntdRegistry>
            </body>
        </html>
    );
}
