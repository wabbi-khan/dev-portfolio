import "./globals.css";

export const metadata = {
  title: "Abdul Wahab Khan | Front-End Developer",
  description:
    "Abdul Wahab Khan — Front-End Developer with 3+ years of experience in React.js, Next.js, and modern web technologies. Based in Hyderabad, Pakistan.",
  keywords: [
    "Abdul Wahab Khan",
    "Front-End Developer",
    "React Developer",
    "Next.js Developer",
    "Web Developer Pakistan",
    "Hyderabad Pakistan",
  ],
  authors: [{ name: "Abdul Wahab Khan" }],
  openGraph: {
    title: "Abdul Wahab Khan | Front-End Developer",
    description:
      "Building fast, user-focused, and visually striking websites with React.js & Next.js.",
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
