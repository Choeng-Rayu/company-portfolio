'use client';

import { cn } from '@/lib/utils';
import { ArrowRight, Rocket, Tag } from 'lucide-react';
import { useState } from 'react';

export interface CardFlipProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  color?: string;
  image?: string;
}

export default function CardFlip({
  title = 'Build MVPs Fast',
  subtitle = 'Launch your idea in record time',
  description = 'Copy, paste, customize—and launch your MVP faster than ever with our developer-first component library.',
  features = [
    'Copy & Paste Ready',
    'Developer-First',
    'MVP Optimized',
    'Zero Setup Required',
  ],
  color = '#ccff00', // Default to accent-lime
  image
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      style={{
        ['--primary' as any]: color ?? '#ccff00',
      }}
      className="group relative h-[360px] w-full max-w-[300px] [perspective:2000px] cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          'relative h-full w-full',
          '[transform-style:preserve-3d]',
          'transition-all duration-700',
          isFlipped
            ? '[transform:rotateY(180deg)]'
            : '[transform:rotateY(0deg)]',
        )}
      >
        {/* Front of card */}
        <div
          className={cn(
            'absolute inset-0 h-full w-full',
            '[transform:rotateY(0deg)] [backface-visibility:hidden]',
            'overflow-hidden rounded-2xl liquid-glass-card',
            'transition-all duration-700',
            isFlipped ? 'opacity-0' : 'opacity-100',
          )}
        >
          {image ? (
            <div className="absolute inset-0 z-0">
              <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/50 to-transparent" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pt-20 z-0">
              <div className="relative flex h-[100px] w-[200px] flex-col items-center justify-center gap-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-3 w-full rounded-sm',
                      'bg-gradient-to-r from-[rgba(204,255,0,0.2)] via-[rgba(204,255,0,0.3)] to-[rgba(204,255,0,0.2)]',
                      'animate-[slideIn_2s_ease-in-out_infinite]',
                      'opacity-0',
                    )}
                    style={{
                      width: `${60 + Math.random() * 40}%`,
                      animationDelay: `${i * 0.2}s`,
                      marginLeft: `${Math.random() * 20}%`,
                    }}
                  />
                ))}

                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={cn(
                      'h-12 w-12 rounded-xl',
                      'bg-white/10 border border-white/20 backdrop-blur-md',
                      'flex items-center justify-center',
                      'shadow-[0_0_15px_rgba(204,255,0,0.2)]',
                      'animate-pulse',
                      'transition-all duration-500 group-hover:scale-110 group-hover:rotate-12',
                    )}
                  >
                    <Rocket className="h-6 w-6 text-accent-lime" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom content */}
          <div className="absolute right-0 bottom-0 left-0 p-6 z-10">
            <div className="space-y-2">
              <h3 className="font-display text-xl text-white leading-snug group-hover:text-accent-lime transition-all duration-500 ease-out group-hover:translate-y-[-4px]">
                {title}
              </h3>
              <p className="line-clamp-2 font-mono text-[0.6rem] text-white/70 transition-all delay-[50ms] duration-500 ease-out group-hover:translate-y-[-4px]">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            'absolute inset-0 h-full w-full',
            '[transform:rotateY(180deg)] [backface-visibility:hidden]',
            'rounded-2xl p-6 liquid-glass-card',
            'flex flex-col',
            'transition-all duration-700',
            !isFlipped ? 'opacity-0' : 'opacity-100',
          )}
        >
          <div className="relative z-10 flex-1 space-y-4">
            <div className="space-y-2">
              <h3 className="font-display text-xl text-text-primary leading-snug mb-2 group-hover:text-accent-lime transition-colors">
                {title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed line-clamp-5 flex-1">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
              {features.map((feature, index) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[0.6rem] tracking-wide text-text-muted border border-white/5 bg-white/[0.03]"
                  style={{
                    transform: isFlipped ? 'translateX(0)' : 'translateX(-10px)',
                    opacity: isFlipped ? 1 : 0,
                    transition: 'all 0.5s',
                    transitionDelay: `${index * 100 + 200}ms`,
                  }}
                >
                  <Tag size={8} />
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-auto pt-4 border-t border-white/5">
            <div className="flex items-center gap-1 text-accent-lime font-mono text-xs group-hover:gap-2 transition-all">
              Read More <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          0% {
            transform: translateX(-100px);
            opacity: 0;
          }
          50% {
            transform: translateX(0);
            opacity: 0.8;
          }
          100% {
            transform: translateX(100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}