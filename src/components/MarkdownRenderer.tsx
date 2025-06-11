import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const REMARK_PLUGINS = [remarkGfm];

const MARKDOWN_ENTITIES = {
  blockquote: {
    html: "&gt;",
    markdown: ">",
  },
};

const decodeMarkdownEntities = (text: string) => {
  return Object.values(MARKDOWN_ENTITIES).reduce((decodedText, entity) => {
    return decodedText.replace(new RegExp(entity.html, "g"), entity.markdown);
  }, text);
};

type MarkdownRendererProps = {
  markdown: string;
};

export function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  const decodedMarkdown = decodeMarkdownEntities(markdown);

  return (
    <ReactMarkdown remarkPlugins={REMARK_PLUGINS}>
      {decodedMarkdown}
    </ReactMarkdown>
  );
}
