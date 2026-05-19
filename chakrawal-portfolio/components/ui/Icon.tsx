import {
  Building2,
  Code,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Radio,
  Send,
  Share2,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Building2,
  Code,
  Facebook: Share2,
  Github: Code,
  Globe,
  Instagram: Radio,
  Linkedin: Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Share2,
  TrendingUp,
  Twitter: Radio,
  Zap,
};

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export function Icon({ name, className, size = 20 }: IconProps) {
  const Component = icons[name] ?? Code;
  return <Component aria-hidden="true" className={className} size={size} strokeWidth={1.8} />;
}
