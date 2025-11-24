"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@root/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import BlogEditor from "@/components/admin/BlogEditor";
import { LogOut, User, Briefcase, Award, Eye, GraduationCap, Building, FileText } from "lucide-react";
import ProfileEditor from "@/components/admin/ProfileEditor";
import ProjectsEditor from "@/components/admin/ProjectsEditor";
import SkillsEditor from "@/components/admin/SkillsEditor";
import EducationEditor from "@/components/admin/EducationEditor";
import ExperienceEditor from "@/components/admin/ExperienceEditor";
import { cn } from "@/lib/utils";

type TabType = "profile" | "projects" | "skills" | "education" | "experience" | "blog";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth");
        return;
      }

      // Allow any authenticated user to access admin (no role check)
      setIsAdmin(true);
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const navItems = [
    { id: "profile" as TabType, label: "Profile", icon: User },
    { id: "education" as TabType, label: "Học vấn", icon: GraduationCap },
    { id: "experience" as TabType, label: "Kinh nghiệm", icon: Building },
    { id: "projects" as TabType, label: "Dự án", icon: Briefcase },
    { id: "skills" as TabType, label: "Kỹ năng", icon: Award },
    { id: "blog" as TabType, label: "Blog", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => window.open("/", "_blank")}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Xem Portfolio</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Đăng xuất"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-2">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-accent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 p-4 bg-card rounded-lg border shadow-card">
                <h3 className="text-sm font-semibold mb-3">Trạng thái</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Portfolio</span>
                    <span className="text-green-600 font-medium">● Live</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <div className="animate-fade-in">
              {activeTab === "profile" && <ProfileEditor />}
              {activeTab === "education" && <EducationEditor />}
              {activeTab === "experience" && <ExperienceEditor />}
              {activeTab === "projects" && <ProjectsEditor />}
              {activeTab === "skills" && <SkillsEditor />}
              {activeTab === "blog" && <BlogEditor />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}