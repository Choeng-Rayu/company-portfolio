import { useMemo, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import './OrbitImages.css';

function generateEllipsePath(cx: number, cy: number, rx: number, ry: number) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
}

function generateCirclePath(cx: number, cy: number, r: number) {
  return generateEllipsePath(cx, cy, r, r);
}

interface OrbitItemProps {
  item: React.ReactNode;
  index: number;
  totalItems: number;
  path: string;
  itemSize: number;
  rotation: number;
  progress: ReturnType<typeof useMotionValue<number>>;
  fill: boolean;
  isActive?: boolean;
  info?: React.ReactNode;
}

function OrbitItem({ item, index, totalItems, path, itemSize, rotation, progress, fill, isActive, info }: OrbitItemProps) {
  const itemOffset = fill ? (index / totalItems) * 100 : 0;
  const offsetDistance = useTransform(progress, (p: number) => {
    const offset = (((p + itemOffset) % 100) + 100) % 100;
    return `${offset}%`;
  });

  return (
    <motion.div
      className="orbit-item"
      style={{
        width: itemSize,
        height: itemSize,
        offsetPath: `path('${path}')`,
        offsetDistance,
        offsetRotate: '0deg',
        zIndex: isActive ? 20 : 1,
      }}
    >
      {/* Counter-rotate the inner content so it stays upright */}
      <div style={{ width: '100%', height: '100%', transform: `rotate(${-rotation}deg)`, position: 'relative' }}>
        {item}
        {isActive && info && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 48px)',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 280,
              pointerEvents: 'auto',
              zIndex: 30,
            }}
          >
            {info}
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface OrbitImagesProps {
  images?: string[];
  altPrefix?: string;
  shape?: 'circle' | 'ellipse';
  baseWidth?: number;
  radiusX?: number;
  radiusY?: number;
  radius?: number;
  rotation?: number;
  duration?: number;
  itemSize?: number;
  direction?: 'normal' | 'reverse';
  fill?: boolean;
  className?: string;
  showPath?: boolean;
  pathColor?: string;
  pathWidth?: number;
  easing?: string;
  paused?: boolean;
  centerContent?: React.ReactNode;
  responsive?: boolean;
  renderItem?: (src: string, index: number) => React.ReactNode;
  activeIndex?: number;
  renderInfo?: (index: number) => React.ReactNode;
}

export default function OrbitImages({
  images = [],
  altPrefix = 'Orbiting image',
  shape = 'ellipse',
  baseWidth = 900,
  radiusX = 400,
  radiusY = 100,
  radius = 300,
  rotation = -8,
  duration = 40,
  itemSize = 64,
  direction = 'normal',
  fill = true,
  className = '',
  showPath = false,
  pathColor = 'rgba(200,241,53,0.2)',
  pathWidth = 1,
  easing = 'linear',
  paused = false,
  centerContent,
  responsive = true,
  renderItem,
  activeIndex,
  renderInfo,
}: OrbitImagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const cx = baseWidth / 2;
  const cy = baseWidth / 2;

  const path = useMemo(() => {
    if (shape === 'circle') return generateCirclePath(cx, cy, radius);
    return generateEllipsePath(cx, cy, radiusX, radiusY);
  }, [shape, cx, cy, radiusX, radiusY, radius]);

  useEffect(() => {
    if (!responsive || !containerRef.current) return;
    const update = () => {
      if (containerRef.current)
        setScale(containerRef.current.clientWidth / baseWidth);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [responsive, baseWidth]);

  const progress = useMotionValue(0);
  useEffect(() => {
    if (paused) return;
    const ctrl = animate(progress, direction === 'reverse' ? -100 : 100, {
      duration,
      ease: easing as never,
      repeat: Infinity,
      repeatType: 'loop',
    });
    return () => ctrl.stop();
  }, [progress, duration, easing, direction, paused]);

  const items = images.map((src, index) =>
    renderItem ? renderItem(src, index) : (
      <img key={index} src={src} alt={`${altPrefix} ${index + 1}`} className="orbit-image" />
    )
  );

  return (
    <div
      ref={containerRef}
      className={`orbit-container ${className}`}
      style={{ width: '100%', height: responsive ? baseWidth * scale : baseWidth, overflow: 'visible' }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: baseWidth,
          height: baseWidth,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Rotated orbit track */}
        <div style={{ width: '100%', height: '100%', transform: `rotate(${rotation}deg)`, transformOrigin: 'center center', position: 'relative' }}>
          {showPath && (
            <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} viewBox={`0 0 ${baseWidth} ${baseWidth}`}>
              <path d={path} fill="none" stroke={pathColor} strokeWidth={pathWidth} strokeDasharray="4 4" />
            </svg>
          )}
          {items.map((item, index) => (
            <OrbitItem
              key={index}
              item={item}
              index={index}
              totalItems={items.length}
              path={path}
              itemSize={itemSize}
              rotation={rotation}
              progress={progress}
              fill={fill}
              isActive={activeIndex === index}
              info={renderInfo ? renderInfo(index) : undefined}
            />
          ))}
        </div>

        {/* Center content — outside the rotation wrapper so it stays centered */}
        {centerContent && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }}>
              {centerContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
