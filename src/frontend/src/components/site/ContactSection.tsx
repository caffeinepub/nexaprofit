import { useState } from 'react';
import { useLeadSubmission } from '../../hooks/useLeadSubmission';
import { useLeads } from '../../hooks/useLeads';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Mail, Send, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [showLeads, setShowLeads] = useState(false);

  const { mutate: submitLead, isPending, isSuccess, isError } = useLeadSubmission();
  const { data: leads, isLoading: leadsLoading } = useLeads(showLeads);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    submitLead(
      { name, email, message },
      {
        onSuccess: () => {
          setName('');
          setEmail('');
          setMessage('');
          setErrors({});
        },
      }
    );
  };

  return (
    <section id="contact" className="py-24 bg-card/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium mb-4">
            <Mail className="h-4 w-4" />
            Get in Touch
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground to-red-500 bg-clip-text text-transparent">
              Start Your Investment Journey
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Have questions? Want to learn more? Our team is here to help you get started.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/50 backdrop-blur border-border/40">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you shortly.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your investment goals..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`min-h-[120px] ${errors.message ? 'border-red-500' : ''}`}
                  />
                  {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
                </div>

                {isSuccess && (
                  <Alert className="border-green-500/30 bg-green-500/5">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-500">
                      Thank you! Your message has been sent successfully.
                    </AlertDescription>
                  </Alert>
                )}

                {isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Failed to send message. Please try again.</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                  disabled={isPending}
                >
                  {isPending ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Admin Toggle for Recent Inquiries */}
          <Card className="mt-6 bg-card/50 backdrop-blur border-border/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Inquiries</CardTitle>
                  <CardDescription>View submitted contact forms (admin view)</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="show-leads" className="text-sm cursor-pointer">
                    {showLeads ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Label>
                  <Switch id="show-leads" checked={showLeads} onCheckedChange={setShowLeads} />
                </div>
              </div>
            </CardHeader>
            {showLeads && (
              <CardContent>
                {leadsLoading && <p className="text-sm text-muted-foreground">Loading inquiries...</p>}
                {leads && leads.length === 0 && (
                  <p className="text-sm text-muted-foreground">No inquiries yet.</p>
                )}
                {leads && leads.length > 0 && (
                  <div className="space-y-4">
                    {leads.map((lead, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border/40 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{lead.name}</p>
                            <p className="text-sm text-muted-foreground">{lead.email}</p>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed">{lead.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
