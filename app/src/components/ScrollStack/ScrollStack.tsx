import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './ScrollStack.css';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollStackItemProps {
  children: ReactNode;
  itemClassName?: string;
}

export const ScrollStackItem = ({ children, itemClassName = '' }: ScrollStackItemProps) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

export interface ScrollStackProps {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete
}: ScrollStackProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = gsap.utils.toArray<HTMLDivElement>('.scroll-stack-card', scroller);
    if (!cards.length) return;

    // Reset styles for GSAP
    gsap.set(cards, {
      transformOrigin: 'top center',
      willChange: 'transform, filter',
    });

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      
      const isLast = i === cards.length - 1;
      const targetScale = 1 - (cards.length - 1 - i) * itemScale;
      const targetRotation = (cards.length - 1 - i) * rotationAmount;
      
      // Pin each card when it reaches its stack position
      ScrollTrigger.create({
        trigger: card,
        start: `top ${stackPosition}`,
        endTrigger: scroller,
        end: 'bottom bottom',
        pin: true,
        pinSpacing: false,
        id: `card-${i}`,
        onEnter: () => {
          if (isLast && onStackComplete) onStackComplete();
        }
      });

      // Animate the card as the NEXT cards scroll up
      if (i < cards.length - 1) {
        const nextCards = cards.slice(i + 1);
        
        nextCards.forEach((nextCard, nextIndex) => {
           // As each subsequent card enters, this card scales down further
           gsap.to(card, {
             scrollTrigger: {
               trigger: nextCard,
               start: `top ${stackPosition}`,
               end: `top ${stackPosition}`,
               scrub: true,
             },
             scale: 1 - (nextIndex + 1) * itemScale,
             rotation: (nextIndex + 1) * rotationAmount,
             filter: blurAmount ? `blur(${(nextIndex + 1) * blurAmount}px)` : 'none',
             ease: 'none'
           });
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().filter(st => st.vars.id?.startsWith('card-')).forEach(st => st.kill());
    };
  }, { scope: scrollerRef, dependencies: [itemDistance, itemScale, rotationAmount, blurAmount, stackPosition] });

  return (
    <div
      className={`scroll-stack-scroller ${useWindowScroll ? 'scroll-stack-window' : ''} ${className}`.replace(/\s+/g, ' ').trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
