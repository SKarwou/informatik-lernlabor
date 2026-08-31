declare module "next" {
  export type Metadata = Record<string, unknown>;
}

declare module "next/link" {
  import type { ComponentType, AnchorHTMLAttributes, ReactNode } from "react";
  const Link: ComponentType<AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }>;
  export default Link;
}
