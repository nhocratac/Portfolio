import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // Import highlight.js style

interface MarkdownRendererProps {
    content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="prose prose-invert max-w-none prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-a:text-blue-400 prose-strong:text-zinc-100 prose-code:text-zinc-200 prose-pre:bg-zinc-900 prose-li:text-zinc-300">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    // Custom components if needed
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
