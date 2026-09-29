import "./globals.css";

export const metadata = {
  title: "Wahab Khan | Full Stack Software Engineer | AI Products & SaaS",
  description:
    "Wahab Khan — Full Stack Software Engineer with 4 years of experience, specializing in AI-powered SaaS, Next.js, React.js, Node.js, and Generative AI. Based in Karachi, Pakistan.",
  keywords: [
    "Wahab Khan",
    "Full Stack Software Engineer",
    "AI Products",
    "SaaS",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "Generative AI",
    "Karachi",
    "Pakistan",
  ],
  authors: [{ name: "Wahab Khan" }],
  openGraph: {
    title: "Wahab Khan | Full Stack Software Engineer | AI Products & SaaS",
    description:
      "Building full-stack AI-powered SaaS products, agentic workflows, and high-performance web applications with React.js, Next.js, and Node.js.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* add favcion logo.png  */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />

      <body className="antialiased" suppressHydrationWarning>
        <main>{children}</main>
      </body>
    </html>
  );
}
