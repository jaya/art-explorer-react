"use client";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex items-center justify-center p-1 bg-amber-400">
      <p className="text-sm">
        &copy;{new Date().getFullYear()} Art Explorer, by{" "}
        <Link href="https://www.github.com/jonathas3c">Jonathas Germano</Link>
      </p>
    </footer>
  );
}

export default Footer;
