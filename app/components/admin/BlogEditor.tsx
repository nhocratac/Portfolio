"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Eye, Save, X } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { toast } from "sonner";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    category: string | null;
    status: "draft" | "published" | null;
    published_at: string | null;
}

export default function BlogEditor() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Partial<BlogPost>>({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        category: "",
        status: "draft",
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from("blog_posts")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            if (data) setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast.error("Không thể tải danh sách bài viết");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setEditingPost(null);
        setFormData({
            title: "",
            slug: "",
            content: "",
            excerpt: "",
            category: "",
            status: "draft",
        });
        setPreviewMode(false);
        setIsDialogOpen(true);
    };

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt || "",
            category: post.category || "",
            status: post.status,
        });
        setPreviewMode(false);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

        try {
            const { error } = await supabase.from("blog_posts").delete().eq("id", id);
            if (error) throw error;

            setPosts(posts.filter((p) => p.id !== id));
            toast.success("Đã xóa bài viết");
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Lỗi khi xóa bài viết");
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData((prev) => ({
            ...prev,
            title,
            slug: !editingPost ? generateSlug(title) : prev.slug,
        }));
    };

    const handleSave = async () => {
        if (!formData.title || !formData.slug || !formData.content) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        try {
            const postData = {
                title: formData.title,
                slug: formData.slug,
                content: formData.content,
                excerpt: formData.excerpt || null,
                category: formData.category || null,
                status: formData.status || "draft",
                published_at: formData.status === "published" ? new Date().toISOString() : null,
                updated_at: new Date().toISOString(),
            };

            if (editingPost) {
                const { error } = await supabase
                    .from("blog_posts")
                    .update(postData)
                    .eq("id", editingPost.id);
                if (error) throw error;
                toast.success("Cập nhật bài viết thành công");
            } else {
                const { error } = await supabase.from("blog_posts").insert(postData);
                if (error) throw error;
                toast.success("Tạo bài viết mới thành công");
            }

            setIsDialogOpen(false);
            fetchPosts();
        } catch (error) {
            console.error("Error saving post:", error);
            toast.error("Lỗi khi lưu bài viết");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-zinc-100">Quản lý Blog</h2>
                <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" /> Viết bài mới
                </Button>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                                <TableHead className="text-zinc-400">Tiêu đề</TableHead>
                                <TableHead className="text-zinc-400">Danh mục</TableHead>
                                <TableHead className="text-zinc-400">Trạng thái</TableHead>
                                <TableHead className="text-zinc-400">Ngày đăng</TableHead>
                                <TableHead className="text-right text-zinc-400">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                                        Đang tải...
                                    </TableCell>
                                </TableRow>
                            ) : posts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                                        Chưa có bài viết nào
                                    </TableCell>
                                </TableRow>
                            ) : (
                                posts.map((post) => (
                                    <TableRow key={post.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                        <TableCell className="font-medium text-zinc-200">{post.title}</TableCell>
                                        <TableCell className="text-zinc-400">{post.category || "-"}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${post.status === "published"
                                                    ? "bg-green-500/10 text-green-400"
                                                    : "bg-yellow-500/10 text-yellow-400"
                                                    }`}
                                            >
                                                {post.status === "published" ? "Đã đăng" : "Nháp"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-zinc-400">
                                            {post.published_at
                                                ? new Date(post.published_at).toLocaleDateString("vi-VN")
                                                : "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(post)}
                                                    className="hover:bg-zinc-800 text-zinc-400 hover:text-white"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(post.id)}
                                                    className="hover:bg-red-900/20 text-zinc-400 hover:text-red-400"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-zinc-100">
                            {editingPost ? "Chỉnh sửa bài viết" : "Viết bài mới"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-zinc-300">Tiêu đề *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    className="bg-zinc-900 border-zinc-800 text-zinc-100"
                                    placeholder="Nhập tiêu đề bài viết"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-zinc-300">Slug *</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="bg-zinc-900 border-zinc-800 text-zinc-100"
                                    placeholder="tieu-de-bai-viet"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-zinc-300">Danh mục</Label>
                                <Input
                                    id="category"
                                    value={formData.category || ""}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="bg-zinc-900 border-zinc-800 text-zinc-100"
                                    placeholder="Ví dụ: Tech, Life, Tutorial"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-zinc-300">Trạng thái</Label>
                                <select
                                    id="status"
                                    value={formData.status || "draft"}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })}
                                    className="w-full h-10 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700"
                                >
                                    <option value="draft">Nháp</option>
                                    <option value="published">Công khai</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt" className="text-zinc-300">Mô tả ngắn</Label>
                            <Textarea
                                id="excerpt"
                                value={formData.excerpt || ""}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="bg-zinc-900 border-zinc-800 text-zinc-100 h-20"
                                placeholder="Mô tả ngắn về bài viết (SEO description)"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="content" className="text-zinc-300">Nội dung (Markdown) *</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPreviewMode(!previewMode)}
                                    className="text-xs h-8"
                                >
                                    {previewMode ? <><Pencil className="h-3 w-3 mr-1" /> Soạn thảo</> : <><Eye className="h-3 w-3 mr-1" /> Xem trước</>}
                                </Button>
                            </div>

                            {previewMode ? (
                                <div className="min-h-[400px] p-4 rounded-md border border-zinc-800 bg-zinc-900 overflow-y-auto prose prose-invert max-w-none">
                                    <MarkdownRenderer content={formData.content || ""} />
                                </div>
                            ) : (
                                <Textarea
                                    id="content"
                                    value={formData.content || ""}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="bg-zinc-900 border-zinc-800 text-zinc-100 min-h-[400px] font-mono"
                                    placeholder="# Tiêu đề bài viết..."
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-zinc-800">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-zinc-400 hover:text-white">
                            Hủy
                        </Button>
                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                            <Save className="h-4 w-4 mr-2" /> Lưu bài viết
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
