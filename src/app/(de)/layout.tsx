import type { Metadata } from "next";
import { SiteShell, rootMetadata } from "@/components/layout/root-layout";

export const metadata: Metadata = rootMetadata("de");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang={"de"}>{children}</SiteShell>;
}
