"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    published_at: string | null;
    category: string | null;
}

export default function FeaturedBlogs() {
    const [posts, setPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const { data } = await supabase
            .from("blog_posts")
            .select("id, title, slug, excerpt, published_at, category")
            .eq("status", "published")
            .order("published_at", { ascending: false })
            .limit(3);

        if (data) {
            setPosts(data);
        }
    };

    if (posts.length === 0) return null;

    return (
        <section id="blog" className="container mx-auto px-4 py-24">
            <div className="mb-12 flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-zinc-100 md:text-4xl">
                        Bài viết mới nhất
                    </h2>
                    <p className="mt-4 text-zinc-400">
                        Chia sẻ kiến thức và kinh nghiệm lập trình
                    </p>
                </div>
                <Link
                    href="/blog"
                    className="hidden items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white md:flex"
                >
                    Xem tất cả <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                ))}
            </div>

            <div className="mt-8 flex justify-center md:hidden">
                <Link
                    href="/blog"
                    className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white"
                >
                    Xem tất cả <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </section>
    );
}
