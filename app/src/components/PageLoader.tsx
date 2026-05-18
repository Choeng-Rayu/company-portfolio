export default function PageLoader({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="font-small text-small text-text-muted animate-pulse">{text}</div>
    </div>
  );
}
