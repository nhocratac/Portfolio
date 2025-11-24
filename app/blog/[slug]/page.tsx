"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Calendar, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface BlogPost {
    id: string;
    title: string;
    content: string;
    published_at: string | null;
    category: string | null;
    reading_time: number | null;
}

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetchPost(slug);
        }
    }, [slug]);

    const fetchPost = async (slug: string) => {
        try {
            const { data, error } = await supabase
                .from("blog_posts")
                .select("id, title, content, published_at, category, reading_time")
                .eq("slug", slug)
                .eq("status", "published")
                .single();

            if (error) {
                console.error("Error fetching post:", error);
                setLoading(false);
                return;
            }

            if (data) {
                setPost(data);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="h-8 w-32 bg-zinc-900 rounded mb-8 animate-pulse" />
                    <div className="h-12 w-3/4 bg-zinc-900 rounded mb-6 animate-pulse" />
                    <div className="h-6 w-1/2 bg-zinc-900 rounded mb-12 animate-pulse" />
                    <div className="space-y-4">
                        <div className="h-4 bg-zinc-900 rounded animate-pulse" />
                        <div className="h-4 bg-zinc-900 rounded animate-pulse" />
                        <div className="h-4 bg-zinc-900 rounded w-2/3 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-zinc-950 pt-24 pb-16 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-zinc-100 mb-4">Bài viết không tồn tại</h1>
                <Link href="/blog" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Quay lại Blog
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-3xl">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại Blog
                </Link>

                <article>
                    <header className="mb-12">
                        <div className="flex items-center gap-4 text-sm text-zinc-400 mb-6">
                            {post.published_at && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
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
                                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
                                    {post.category}
                                </span>
                            )}
                            {post.reading_time && (
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{post.reading_time} phút đọc</span>
                                </div>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-zinc-100 leading-tight">
                            {post.title}
                        </h1>
                    </header>

                    <div className="prose prose-invert max-w-none">
                        <MarkdownRenderer content={post.content} />
                    </div>
                </article>
            </div>
        </div>
    );
}
