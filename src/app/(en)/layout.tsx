import type { Metadata } from "next";
import { SiteShell, rootMetadata } from "@/components/layout/root-layout";

export const metadata: Metadata = rootMetadata("en");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang={"en"}>{children}</SiteShell>;
}
