import type { AnchorHTMLAttributes, ReactNode } from "react";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function toStaticHref(href: string) {
  if (!href.startsWith("/")) return href;

  const [path, anchor] = href.split("#", 2);
  const page = path === "/" ? "home" : path.replace(/^\//, "");
  const query = page === "home" ? "" : `?page=${encodeURIComponent(page)}`;

  return `${query}${anchor ? `#${anchor}` : ""}` || "./";
}

export default function Link({ href, children, ...props }: LinkProps) {
  return <a href={toStaticHref(href)} {...props}>{children}</a>;
}
