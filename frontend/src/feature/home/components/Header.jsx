import { useEffect, useState } from "react";
import logoImg from "../../../assets/logo.png";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-neutral-950/60 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-2xl"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo Only */}
        <a href="#home" className="flex items-center group pointer-events-auto">
          <img
            src={logoImg}
            alt="CareLine Logo"
            className="h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </a>

        {/* Desktop Menu Navigation - Soft white text to blend into the cinematic backdrop */}
        <div className="hidden lg:flex items-center gap-10 pointer-events-auto">
          {["Home", "About", "Blog", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative text-[13px] font-semibold tracking-widest text-neutral-300 hover:text-white uppercase transition-colors duration-300 py-1 group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* CTA Actions Group */}
        <div className="hidden lg:flex items-center gap-6 pointer-events-auto">
          {/* Subtle Login Action */}
          <a
            href="#login"
            className="text-[13px] font-semibold tracking-widest uppercase text-neutral-300 hover:text-white transition-colors duration-300 px-2 py-1"
          >
            Login
          </a>
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="lg:hidden flex items-center pointer-events-auto">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-300 hover:text-white transition-colors duration-200"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[68px] bg-black/60 backdrop-blur-sm z-40 pointer-events-auto">
          <div className="w-full bg-neutral-950 border-b border-white/10 p-8 flex flex-col gap-6 animate-fade-in shadow-2xl">
            {["Home", "About", "Blog", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold tracking-wider uppercase text-neutral-300 hover:text-white py-1 transition-colors duration-200"
              >
                {item}
              </a>
            ))}

            <hr className="border-white/10" />

            <div className="flex flex-col gap-4">
              <a
                href="#login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center font-semibold tracking-wider uppercase text-neutral-300 hover:text-white py-2 text-sm transition-colors duration-200"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
