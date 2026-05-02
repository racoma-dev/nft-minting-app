"use client";

import { GithubIcon } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t sticky top-full">
      <div className="container h-16 flex justify-between items-center">
        <p>&copy; {new Date().getFullYear()} rcm0208</p>
        <Link
          href="https://github.com/rcm0208"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <GithubIcon className="w-6 h-6" />
          <span className="sr-only">GitHub</span>
        </Link>
      </div>
    </footer>
  );
}
