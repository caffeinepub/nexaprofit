import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'AI Insights', href: '#insights' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/assets/1771048883652-8.png" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            NexaProfit Secure
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-background rounded-sm px-2 py-1"
            >
              {link.label}
            </button>
          ))}
          <Button
            variant="default"
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/20"
          >
            Get Started
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-left text-lg font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-background rounded-sm px-2 py-2"
                >
                  {link.label}
                </button>
              ))}
              <Button
                variant="default"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white mt-4"
              >
                Get Started
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
