import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How does the AI-powered investment platform work?',
    answer:
      'Our platform uses advanced machine learning algorithms to analyze vast amounts of market data in real-time. The AI identifies patterns, trends, and opportunities that would be difficult for humans to spot, providing you with actionable insights to inform your investment decisions.',
  },
  {
    question: 'What makes your AI technology different from traditional investment tools?',
    answer:
      'Unlike traditional tools that rely on historical data and static rules, our AI continuously learns and adapts to changing market conditions. It processes millions of data points per second, including news sentiment, technical indicators, and macroeconomic factors, to provide dynamic, forward-looking insights.',
  },
  {
    question: 'Is my investment data secure?',
    answer:
      'Absolutely. We employ bank-level encryption and security protocols to protect your data. All information is encrypted both in transit and at rest, and we never share your personal or financial information with third parties without your explicit consent.',
  },
  {
    question: 'What is the minimum investment required?',
    answer:
      'The minimum investment varies by plan. Our Conservative Income Plan starts at $500, the Balanced Growth Portfolio requires $1,000, and the High-Yield Equities Focus has a minimum of $2,500. Each plan is designed to accommodate different investment goals and risk tolerances.',
  },
  {
    question: 'Can I withdraw my investment at any time?',
    answer:
      'Yes, you maintain full control over your investments. You can withdraw funds at any time, though we recommend consulting with our AI-powered advisory system to understand the optimal timing for withdrawals based on market conditions and your financial goals.',
  },
  {
    question: 'How accurate are the AI predictions?',
    answer:
      'Our AI models have demonstrated a 98% accuracy rate in backtesting scenarios. However, it\'s important to note that past performance doesn\'t guarantee future results. The AI provides insights and recommendations, but all investment decisions ultimately rest with you.',
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-background to-card/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground to-red-500 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about our AI-powered investment platform.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card/50 backdrop-blur border border-border/40 rounded-lg px-6 data-[state=open]:border-red-500/50"
              >
                <AccordionTrigger className="text-left hover:text-red-500 transition-colors hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
