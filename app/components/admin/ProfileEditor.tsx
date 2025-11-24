import { useEffect, useState } from "react";
import { supabase } from "@root/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, User, Globe, Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";

const ProfileEditor = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    title: "",
    bio: "",
    avatar_url: "",
    email: "",
    phone: "",
    location: "",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
    website_url: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("profile")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (data) {
        // Map null values to empty strings to match formData type
        setFormData({
          full_name: data.full_name || "",
          title: data.title || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          github_url: data.github_url || "",
          linkedin_url: data.linkedin_url || "",
          twitter_url: data.twitter_url || "",
          website_url: data.website_url || "",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { error } = await supabase
        .from("profile")
        .upsert({
          ...formData,
          user_id: session.user.id,
        });

      if (error) throw error;

      toast({
        title: "✓ Đã lưu",
        description: "Profile của bạn đã được cập nhật thành công",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Cập nhật thông tin hiển thị trên portfolio</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Preview */}
          {formData.avatar_url && (
            <div className="flex justify-center">
              <div className="relative group">
                <img
                  src={formData.avatar_url}
                  alt="Avatar preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                />
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-base">
                Họ và tên <span className="text-destructive">*</span>
              </Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="VD: Nguyễn Văn A"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base">
                Chức danh <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="VD: Full Stack Developer"
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-base">Giới thiệu</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Viết vài dòng giới thiệu về bản thân..."
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {formData.bio.length} ký tự
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar_url" className="text-base">Avatar URL</Label>
            <Input
              id="avatar_url"
              name="avatar_url"
              type="url"
              value={formData.avatar_url}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              className="h-11"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Thông tin liên hệ</CardTitle>
              <CardDescription>Email, số điện thoại và địa chỉ</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Số điện thoại
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0123 456 789"
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Địa chỉ
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Hà Nội, Việt Nam"
              className="h-11"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Mạng xã hội</CardTitle>
              <CardDescription>Liên kết đến các trang mạng xã hội của bạn</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="github_url" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Label>
              <Input
                id="github_url"
                name="github_url"
                type="url"
                value={formData.github_url}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Label>
              <Input
                id="linkedin_url"
                name="linkedin_url"
                type="url"
                value={formData.linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="twitter_url" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter
              </Label>
              <Input
                id="twitter_url"
                name="twitter_url"
                type="url"
                value={formData.twitter_url}
                onChange={handleChange}
                placeholder="https://twitter.com/username"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website_url" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </Label>
              <Input
                id="website_url"
                name="website_url"
                type="url"
                value={formData.website_url}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
                className="h-11"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving}
          size="lg"
          className="gap-2 px-8"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Lưu thay đổi
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditor;
