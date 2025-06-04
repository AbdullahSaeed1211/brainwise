import Link from "next/link";

export function Footer() {
  return (
    <footer className="magic-footer py-8">
      <div className="magic-container">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} <span className="magic-gradient-text font-semibold">Brainwise</span>. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/about"
              className="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[rgb(var(--primary))] hover:to-[rgb(var(--secondary))]"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[rgb(var(--primary))] hover:to-[rgb(var(--secondary))]"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[rgb(var(--primary))] hover:to-[rgb(var(--secondary))]"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 