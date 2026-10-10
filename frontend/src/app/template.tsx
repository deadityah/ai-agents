import { PageTransition } from "@/components/motion/PageTransition";

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition className="flex-1 flex flex-col">{children}</PageTransition>;
}
