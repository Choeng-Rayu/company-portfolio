export default function PageLoader({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="font-mono text-xs text-text-muted animate-pulse">{text}</div>
    </div>
  );
}
