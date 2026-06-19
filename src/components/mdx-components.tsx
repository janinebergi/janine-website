import Image from "next/image";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";

export const mdxComponents: MDXRemoteProps["components"] = {
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
