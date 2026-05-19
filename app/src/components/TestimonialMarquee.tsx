import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";

const testimonials = [
  {
    name: "Chanrith Sok",
    username: "Operations Director, MR Training",
    body: "Chakrawal Digital built our lab management system from scratch. The team understood our workflow and delivered something that actually makes our daily operations easier.",
    img: "https://avatar.vercel.sh/chanrith",
  },
  {
    name: "Sopheap Chea",
    username: "Admin Director, OM Gov",
    body: "We needed a provincial website that citizens could actually use. They delivered a clean, fast site that our elderly residents can navigate without help.",
    img: "https://avatar.vercel.sh/sopheap",
  },
  {
    name: "Dara Oum",
    username: "HR Manager, MR Training",
    body: "Our HRM system went from spreadsheet chaos to a proper platform. Payroll processing dropped from 3 days to under 4 hours. Error rate went to zero.",
    img: "https://avatar.vercel.sh/dara",
  },
  {
    name: "Sreyroth Keo",
    username: "Real Estate Director",
    body: "The custom CRM they developed for our real estate business has transformed how we track leads. The intuitive interface means our agents actually use it.",
    img: "https://avatar.vercel.sh/sreyroth",
  },
  {
    name: "Vicheka Mean",
    username: "E-commerce Founder",
    body: "Working with the team was seamless. They didn't just write code; they provided strategic advice that helped us scale our platform across Southeast Asia.",
    img: "https://avatar.vercel.sh/vicheka",
  },
  {
    name: "Piseth Long",
    username: "Tech Lead, FinTech",
    body: "Fast, reliable, and technically superior. Their expertise in cloud-native solutions saved us thousands in server costs while improving application uptime.",
    img: "https://avatar.vercel.sh/piseth",
  },
];

const firstRow = testimonials.slice(0, testimonials.length / 2);
const secondRow = testimonials.slice(testimonials.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-80 h-[200px] flex flex-col cursor-pointer overflow-hidden rounded-2xl p-6 transition-all",
        // Liquid Glass Theme
        "liquid-glass-card",
        "hover:bg-white/[0.05]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10">
          <img className="h-full w-full object-cover" alt="" src={img} />
        </div>
        <div className="flex flex-col">
          <figcaption className="font-subheader text-sm font-semibold text-text-primary">
            {name}
          </figcaption>
          <p className="font-small text-xs font-medium text-accent-lime/70">{username}</p>
        </div>
      </div>
      <blockquote className="mt-4 font-body text-sm leading-relaxed text-text-secondary line-clamp-4">
        {body}
      </blockquote>
      
      {/* Subtle bottom highlight */}
      <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-accent-lime/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </figure>
  );
};

export default function TestimonialMarquee() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-10">
      <Marquee pauseOnHover className="[--duration:40s] [--gap:4rem]">
        {firstRow.map((review) => (
          <div key={review.name} className="flex items-center gap-[2rem]">
            <ReviewCard {...review} />
            <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          </div>
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:40s] [--gap:4rem] mt-8">
        {secondRow.map((review) => (
          <div key={review.name} className="flex items-center gap-[2rem]">
            <ReviewCard {...review} />
            <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          </div>
        ))}
      </Marquee>
      
      {/* Side Gradients for fading effect - removed to show background direct */}
    </div>
  );
}
