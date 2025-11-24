"use client";

import { useEffect, useState } from "react";
import { supabase } from "@root/integrations/supabase/client";
import BlogCard from "@/components/BlogCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    published_at: string | null;
    category: string | null;
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from("blog_posts")
                .select("id, title, slug, excerpt, published_at, category")
                .eq("status", "published")
                .order("published_at", { ascending: false });

            if (error) throw error;

            if (data) {
                setPosts(data);
                // Extract unique categories
                const uniqueCategories = Array.from(new Set(data.map((p) => p.category).filter(Boolean) as string[]));
                setCategories(uniqueCategories);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = posts.filter((post) => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-zinc-950 pt-24 pb-16">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-zinc-100 mb-4">Blog</h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Chia sẻ kiến thức, kinh nghiệm và những câu chuyện về lập trình.
                    </p>
                </div>

                <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Tìm kiếm bài viết..."
                            className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-zinc-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === null
                                ? "bg-white text-zinc-950 font-medium"
                                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                                }`}
                        >
                            Tất cả
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === category
                                    ? "bg-white text-zinc-950 font-medium"
                                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 rounded-xl bg-zinc-900 animate-pulse" />
                        ))}
                    </div>
                ) : filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-zinc-500 text-lg">Không tìm thấy bài viết nào.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
