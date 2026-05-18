import { motion } from 'framer-motion';

interface Client {
  name: string;
  initials: string;
  color: string;
}

const clients: Client[] = [
  { name: 'MR Training & Jobs', initials: 'MR', color: '#C8F135' },
  { name: 'Oddar Meanchey Gov', initials: 'OM', color: '#3CB371' },
  { name: 'InnoLab Cambodia', initials: 'IL', color: '#4477DD' },
  { name: 'VersionDragon', initials: 'VD', color: '#E05A20' },
  { name: 'GreenRoute', initials: 'GR', color: '#C8F135' },
  { name: 'PayFlow', initials: 'PF', color: '#3CB371' },
  { name: 'MedConnect', initials: 'MC', color: '#4477DD' },
  { name: 'Automata', initials: 'AU', color: '#E05A20' },
];

function ClientBadge({ client }: { client: Client }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-xl liquid-glass-btn mx-4 flex-shrink-0 group transition-all border-0">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold"
        style={{
          background: `${client.color}18`,
          color: client.color,
        }}
      >
        {client.initials}
      </div>
      <span className="font-mono text-sm tracking-wide text-text-secondary group-hover:text-text-primary transition-colors whitespace-nowrap">
        {client.name}
      </span>
    </div>
  );
}

export default function Marquee() {
  const doubled = [...clients, ...clients, ...clients, ...clients];

  return (
    <section className="w-full py-8 flex items-center justify-center">
      <div className="w-[96%] max-w-[1280px] h-[88px] liquid-glass-nav !rounded-[1.5rem] overflow-hidden flex items-center border-0">
        <div className="flex items-center whitespace-nowrap">
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-muted pl-8 pr-6 flex-shrink-0 bg-white/5 h-[88px] flex items-center">
            Trusted by
          </span>
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {doubled.map((client, i) => (
              <ClientBadge key={`${client.name}-${i}`} client={client} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
