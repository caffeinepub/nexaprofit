import { SiX, SiLinkedin, SiGithub } from 'react-icons/si';
import { Heart } from 'lucide-react';

const footerLinks = [
  { label: 'Features', href: '#features' },
  { label: 'AI Insights', href: '#insights' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { icon: SiX, href: '#', label: 'X' },
  { icon: SiLinkedin, href: '#', label: 'LinkedIn' },
  { icon: SiGithub, href: '#', label: 'GitHub' },
];

export function SiteFooter() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'quantumai-investment'
  );

  return (
    <footer className="border-t border-border/40 bg-card/50 backdrop-blur">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/assets/generated/logo-mark.dim_512x512.png" alt="Logo" className="h-8 w-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                NexaProfit
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered investment insights for the modern investor.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-background rounded-sm"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-background rounded-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="font-semibold mb-4 text-red-500">Important Notice</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This is a demonstration platform. All data, insights, and projections are simulated for illustrative
              purposes only. This does not constitute financial advice. Always consult with a qualified financial
              advisor before making investment decisions.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} QuantumAI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
