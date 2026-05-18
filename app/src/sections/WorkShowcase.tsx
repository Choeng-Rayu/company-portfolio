import { HeroScrub } from '@/components/ui/hero-scrub';

const DEFAULT_FRAMES = [
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555421689-492a1880ceb9?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504384308090-c54be3855833?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=80&auto=format&fit=crop",
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
