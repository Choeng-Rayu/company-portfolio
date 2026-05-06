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
    <section className="w-full py-8 flex items-center justify-center">
      <div className="w-[96%] max-w-[1280px] h-[72px] liquid-glass !rounded-[1.5rem] border border-white/10 overflow-hidden flex items-center">
        <div className="flex items-center whitespace-nowrap">
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-muted pl-12 pr-8 flex-shrink-0 bg-white/5 h-[72px] flex items-center">
            Trusted by
          </span>
          <div className="animate-marquee flex whitespace-nowrap">
            <span className="font-mono text-xs tracking-wider text-text-secondary pr-12">
              {content} \u00B7 {content} \u00B7{' '}
            </span>
            <span className="font-mono text-xs tracking-wider text-text-secondary pr-12">
              {content} \u00B7 {content} \u00B7{' '}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}