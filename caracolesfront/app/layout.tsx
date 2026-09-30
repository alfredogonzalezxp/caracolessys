/*

so, first layout.tsx, then pass children page.tsx, then from 
here shows login form at the same time header.tsx and shows 
logout button if i autenticate.

// c:\Users\Alfrredo\Documents\nextjs\DevCoursesfront\app\layout.tsx
<AuthProvider>
    <Header /> { The Header is rendered immediately }
    <main>
      {children} {/This is the placeholder for the page }
    </main>
</AuthProvider>
*/

/*
Next.js starts.
It renders app/layout.tsx to create the base structure and 
initialize global providers like your AuthProvider.
It then renders app/page.tsx (for the homepage) inside the 
layout.
*/


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { AuthProvider } from "@/app/context/AuthContext";
import Header from "@/app/Header";


/*
import { Inter } from "next/font/google";
This line imports a specific function for the "Inter" 
font from Google Fonts. next/font has built-in support 
for all Google Fonts, making them very easy to use.
const inter = Inter({ subsets: ["latin"] });
in this line const inter = Inter({ subsets: ["latin"] }); 
I said in the var inter store a text of type latin after i 
used the class in inter.className
*/

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

//Metadata interface is for SEO
export const metadata: Metadata = {
  title: "DevCourses",
  description: "Find the best development courses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col`} suppressHydrationWarning>
        <AuthProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
/*
Explain the above code.
<main>: This is a semantic HTML tag. It tells browsers, 
search engines, and screen readers, "This is where the main, 
unique content of this specific page lives." Using it is a 
best practice for accessibility and SEO.

{children}: This is the most important part. {children} is a
special prop in React. In a Next.js layout.tsx file, Next.js 
automatically replaces {children} with the content of the 
current page you are visiting.

In summary, this code creates a designated "main content" 
section that acts as a placeholder for your individual 
page components.

*/