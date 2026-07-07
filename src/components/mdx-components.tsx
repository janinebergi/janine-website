import Image from "next/image";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { SriLankaRouteMap } from "@/components/route-map";
import { BaliRouteMap } from "@/components/bali-route-map";
import { BudgetChart } from "@/components/budget-chart";

export const mdxComponents: MDXRemoteProps["components"] = {
  SriLankaRouteMap,
  BaliRouteMap,
  BudgetChart,
  img: (props) => {
    const { src = "", alt = "" } = props as { src?: string; alt?: string };
    return (
      <span className="my-8 block overflow-hidden rounded-2xl border border-border">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={700}
          className="h-auto w-full object-cover"
        />
      </span>
    );
  },
};
