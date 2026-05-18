import { HeroScrub } from '@/components/ui/hero-scrub';

// TODO: Replace with actual project screenshots (MR Labs, MR HRM, VersionDragon, etc.)
const DEFAULT_FRAMES = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531297461136-82lw9z289527?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1920&q=80&auto=format&fit=crop",
];

export type WorkShowcaseProps = {
  titleTop?: string;
  titleBottom?: string;
  accentHex?: string;
  bgClassName?: string;
  frames?: string[];
  defaultAspect?: number;
};

export default function WorkShowcase({
  titleTop = "Creative",
  titleBottom = "Vision",
  accentHex = "#C8F135",
  bgClassName = "bg-[#0A0A0B]",
  frames = DEFAULT_FRAMES,
  defaultAspect = 16 / 9,
}: WorkShowcaseProps) {
  return (
    <section>
      <HeroScrub
        frameCount={frames.length}
        frameUrl={(i) => frames[Math.min(i, frames.length - 1)]}
        titleTop={titleTop}
        titleBottom={titleBottom}
        bgClassName={bgClassName}
        accentHex={accentHex}
        defaultAspect={defaultAspect}
      />
    </section>
  );
}
