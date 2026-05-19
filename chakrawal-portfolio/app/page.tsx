import { HomePage } from "@/components/sections/HomePage";
import { getSiteContent } from "@/lib/data";

export default function Page() {
  const content = getSiteContent();
  return <HomePage content={content} />;
}
