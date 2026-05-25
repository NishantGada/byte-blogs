import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";
import { useEffect, useMemo, useRef } from "react";
import DOMPurify from "dompurify";
import hljs from "highlight.js/lib/common";
import "highlight.js/styles/atom-one-dark.css";
import "./BlogContent.css";

interface BlogContentProps extends Omit<BoxProps, "dangerouslySetInnerHTML"> {
  html: string;
  emptyMessage?: string;
}

const BlogContent = ({ html, emptyMessage, ...boxProps }: BlogContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const sanitized = useMemo(() => DOMPurify.sanitize(html ?? ""), [html]);

  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current
      .querySelectorAll<HTMLElement>("pre code")
      .forEach((block) => {
        delete block.dataset.highlighted;
        block.removeAttribute("data-highlighted");
        hljs.highlightElement(block);
      });
  }, [sanitized]);

  if (!sanitized.trim()) {
    return (
      <Box className="blog-prose-empty" {...boxProps}>
        {emptyMessage ?? "Nothing to preview yet."}
      </Box>
    );
  }

  return (
    <Box
      ref={contentRef}
      className="blog-prose"
      dangerouslySetInnerHTML={{ __html: sanitized }}
      {...boxProps}
    />
  );
};

export default BlogContent;
