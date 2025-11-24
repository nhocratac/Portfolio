import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    published_at: string | null;
    category: string | null;
}

interface BlogCardProps {
    post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <div className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20 hover:bg-white/10">
            <div>
                <div className="flex items-center gap-4 text-sm text-zinc-400">
                    {post.published_at && (
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <time dateTime={post.published_at}>
                                {new Date(post.published_at).toLocaleDateString("vi-VN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </time>
                        </div>
                    )}
                    {post.category && (
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-zinc-300">
                            {post.category}
                        </span>
                    )}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-zinc-100 group-hover:text-white">
                    <Link href={`/blog/${post.slug}`}>
                        <span className="absolute inset-0" />
                        {post.title}
                    </Link>
                </h3>
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                    {post.excerpt}
                </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-zinc-300 group-hover:text-white">
                Đọc thêm <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
        </div>
    );
}
