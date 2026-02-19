import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WalletMethod {
  label: string;
  network: string;
  address: string;
}

const WALLET_METHODS: WalletMethod[] = [
  {
    label: 'USDT',
    network: 'TRC20',
    address: 'TGUqA6VFb6mU5dtk4887u5Hb6hhRTRYBMh',
  },
  {
    label: 'TRX',
    network: 'Tron',
    address: 'TGUqA6VFb6mU5dtk4887u5Hb6hhRTRYBMh',
  },
  {
    label: 'BNB',
    network: 'BEP20',
    address: '0x912ad482437fd0aede727ac770e8dbc2d9c8500d',
  },
];

export function WalletTransferMethodsList() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (address: string, index: number) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  return (
    <div className="space-y-4">
      {WALLET_METHODS.map((method, index) => (
        <div
          key={index}
          className="rounded-lg border border-border/40 bg-card/30 p-4 space-y-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground">
                {method.label} <span className="text-muted-foreground text-sm">({method.network})</span>
              </h4>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy(method.address, index)}
              className="gap-2"
            >
              {copiedIndex === index ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="break-all text-sm font-mono text-muted-foreground select-all bg-background/50 p-2 rounded border border-border/20">
            {method.address}
          </div>
        </div>
      ))}
    </div>
  );
}
