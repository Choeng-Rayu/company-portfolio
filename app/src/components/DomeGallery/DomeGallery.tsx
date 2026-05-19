import React, { useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router";
import styles from "./DomeGallery.module.css";

/* ─── types ─── */
interface Post {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  image: string;
  slug: string;
}

interface DomeGalleryProps {
  posts?: Post[];
}

/* ─── mock data ─── */
const BLOG_POSTS: Post[] = [
  {
    id: 1,
    title: "The Future of Web Development in 2023",
    excerpt:
      "Exploring emerging technologies and trends that will shape the web development landscape.",
    category: "Technology",
    date: "2023-05-15",
    author: "Sarah Chen",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4a20c8?w=400&h=280&fit=crop",
    slug: "future-of-web-development",
  },
  {
    id: 2,
    title: "Designing for Accessibility: A Guide",
    excerpt:
      "How to create inclusive digital experiences that work for everyone.",
    category: "Design",
    date: "2023-04-28",
    author: "Jake Morrison",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=280&fit=crop",
    slug: "designing-for-accessibility",
  },
  {
    id: 3,
    title: "The Rise of No-Code Platforms: Friend or Foe?",
    excerpt:
      "Examining the impact of no-code tools on professional developers.",
    category: "Industry",
    date: "2023-04-10",
    author: "Emily Zhang",
    image:
      "https://images.unsplash.com/photo-1555066931-436d969a0eb7?w=400&h=280&fit=crop",
    slug: "rise-of-no-code-platforms",
  },
  {
    id: 4,
    title: "React Server Components: What You Need to Know",
    excerpt:
      "A deep dive into React's latest paradigm and how it changes the way we build apps.",
    category: "React",
    date: "2023-03-22",
    author: "David Park",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=280&fit=crop",
    slug: "react-server-components",
  },
  {
    id: 5,
    title: "Building Performant 3D Websites with R3F",
    excerpt:
      "Practical tips for creating smooth, engaging 3D web experiences with React Three Fiber.",
    category: "3D",
    date: "2023-03-05",
    author: "Alex Rivera",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3a5ae?w=400&h=280&fit=crop",
    slug: "building-3d-websites-r3f",
  },
  {
    id: 6,
    title: "Color Theory for Digital Designers",
    excerpt:
      "Understanding how color choices affect user perception and behavior in digital products.",
    category: "Design",
    date: "2023-02-18",
    author: "Maria Santos",
    image:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=280&fit=crop",
    slug: "color-theory-digital-designers",
  },
  {
    id: 7,
    title: "State Management in 2023: Redux, Zustand, or Context?",
    excerpt:
      "Comparing popular state management solutions and when to use each.",
    category: "React",
    date: "2023-02-02",
    author: "Sarah Chen",
    image:
      "https://images.unsplash.com/photo-1633356122102-2c8ab18eb2c6?w=400&h=280&fit=crop",
    slug: "state-management-2023",
  },
  {
    id: 8,
    title: "The Business Case for Design Systems",
    excerpt:
      "How design systems save time, reduce costs, and improve product consistency at scale.",
    category: "Business",
    date: "2023-01-15",
    author: "Jake Morrison",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=280&fit=crop",
    slug: "business-case-design-systems",
  },
  {
    id: 9,
    title: "Getting Started with WebGL: A Beginner's Guide",
    excerpt:
      "An approachable introduction to creating interactive graphics in the browser.",
    category: "3D",
    date: "2023-01-03",
    author: "Alex Rivera",
    image:
      "https://images.unsplash.com/photo-1550684848-f3828800295d?w=400&h=280&fit=crop",
    slug: "getting-started-webgl",
  },
  {
    id: 10,
    title: "The Ethics of AI in Web Design",
    excerpt:
      "Exploring the moral implications and responsibilities when using AI in creative work.",
    category: "Ethics",
    date: "2022-12-20",
    author: "Emily Zhang",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=280&fit=crop",
    slug: "ethics-ai-web-design",
  },
];

/* ─── utilities ─── */
const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
});

const categoryColor = (cat: string) => {
  switch (cat) {
    case "Technology":
      return { background: "#C8F135", color: "#0A0A0B" };
    case "Design":
      return { background: "#6B4EE6", color: "#FFFFFF" };
    case "Industry":
      return { background: "#E6A74E", color: "#0A0A0B" };
    case "React":
      return { background: "#61DAFB", color: "#0A0A0B" };
    case "3D":
      return { background: "#E74EC8", color: "#FFFFFF" };
    case "Business":
      return { background: "#4EC8A5", color: "#0A0A0B" };
    case "Ethics":
      return { background: "#E64E4E", color: "#FFFFFF" };
    default:
      return { background: "#ccc", color: "#000" };
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/* ─── sub-components ─── */

const SectionBadge: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
    <span className="text-xs font-medium tracking-wider uppercase text-text-muted">
      {label}
    </span>
  </div>
);

const GalleryCard: React.FC<{ post: Post; index: number }> = ({
  post,
  index,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      variants={fadeIn(index * 0.1)}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <Link to={`/blog/${post.slug}`} className={styles.cardLink}>
        <motion.div
          className={styles.galleryCard}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.cardImage}>
            <img src={post.image} alt={post.title} loading="lazy" />
            <span
              className={styles.categoryBadge}
              style={{
                backgroundColor: categoryColor(post.category).background,
                color: categoryColor(post.category).color,
              }}
            >
              {post.category}
            </span>
          </div>

          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{post.title}</h3>
            <p className={styles.cardExcerpt}>{post.excerpt}</p>
            <div className={styles.cardMeta}>
              <span>{post.author}</span>
              <span className={styles.metaDivider}>·</span>
              <span>{formatDate(post.date)}</span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

/* ─── main component ─── */
const DomeGallery: React.FC<DomeGalleryProps> = ({ posts = BLOG_POSTS }) => {
  const memorizedPosts = useMemo(() => posts, [posts]);

  return (
    <div className={styles.domeGallery}>
      {/* Background elements */}
      <div className={styles.bgGlow} aria-hidden />

      <div className={styles.gridWrapper}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-center mb-12">
            <SectionBadge label="Latest Articles" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-white mb-4">
              Explore Our Blog
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto text-base md:text-lg">
              Dive into our latest thoughts on design, technology, and
              everything in between.
            </p>
          </div>
        </motion.div>

        <div className={styles.masonryGrid}>
          {memorizedPosts.map((post, index) => (
            <GalleryCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DomeGallery;
