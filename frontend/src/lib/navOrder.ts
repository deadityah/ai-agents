// Navigation route hierarchy index to compute sideways left/right page slide direction.

export interface NavItem {
  href: string;
  label: string;
  index: number;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Home", index: 0 },
  { href: "/research", label: "Research", index: 1 },
  { href: "/history", label: "History", index: 2 },
  { href: "/about", label: "About", index: 3 },
];

export function getNavIndex(pathname: string): number {
  if (!pathname || pathname === "/") return 0;
  if (pathname.startsWith("/research")) return 1;
  if (pathname.startsWith("/history") || pathname.startsWith("/reports")) return 2;
  if (pathname.startsWith("/about")) return 3;
  return 0;
}

export function getDirection(prevIndex: number, nextIndex: number): number {
  if (nextIndex > prevIndex) return 1; // Moving right/forward -> enters from right (+x)
  if (nextIndex < prevIndex) return -1; // Moving left/backward -> enters from left (-x)
  return 0;
}
