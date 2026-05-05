const clients: string[] = [
  'Kasikorn Bank',
  'True Digital',
  'SCB',
  'Accenture',
  'Line Man',
  'Grab',
  'Central Group',
  'Sansiri',
];

export default function Marquee() {
  const content = clients.join(' \u00B7 ');

  return (
    <section className="w-full h-[72px] border-y border-border-surface overflow-hidden bg-transparent flex items-center">
      <div className="flex items-center whitespace-nowrap">
        <span className="font-mono text-xs tracking-[0.08em] uppercase text-text-muted pl-12 pr-8 flex-shrink-0">
          Trusted by
        </span>
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="font-mono text-sm text-text-secondary pr-12">
            {content} \u00B7 {content} \u00B7{' '}
          </span>
          <span className="font-mono text-sm text-text-secondary pr-12">
            {content} \u00B7 {content} \u00B7{' '}
          </span>
        </div>
      </div>
    </section>
  );
}