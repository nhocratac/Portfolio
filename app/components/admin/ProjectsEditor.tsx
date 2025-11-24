import { useEffect, useState } from "react";
import { supabase } from "@root/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, Save, ExternalLink, Github, Image as ImageIcon, Star, GripVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Project {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  demo_url: string;
  github_url: string;
  technologies: string[];
  featured: boolean;
  display_order: number;
}

const ProjectsEditor = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });
      if (data) {
        const mappedProjects = data.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          image_url: project.image_url || "",
          demo_url: project.demo_url || "",
          github_url: project.github_url || "",
          technologies: project.technologies || [],
          featured: project.featured ?? false,
          display_order: project.display_order ?? 0,
        }));
        setProjects(mappedProjects);
      }
    } finally {
      setLoading(false);
    }
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        title: "",
        description: "",
        image_url: "",
        demo_url: "",
        github_url: "",
        technologies: [],
        featured: false,
        display_order: projects.length,
      },
    ]);
  };

  const removeProject = async (index: number) => {
    const project = projects[index];
    if (project.id) {
      await supabase.from("projects").delete().eq("id", project.id);
      toast({
        title: "Đã xóa",
        description: "Dự án đã được xóa",
      });
    }
    setProjects(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);

      const newProjects = arrayMove(projects, oldIndex, newIndex);
      setProjects(newProjects);

      // Update display_order in database
      try {
        for (let i = 0; i < newProjects.length; i++) {
          if (newProjects[i].id) {
            await supabase
              .from("projects")
              .update({ display_order: i })
              .eq("id", newProjects[i].id!);
          }
        }
        toast({
          title: "✓ Đã cập nhật",
          description: "Thứ tự hiển thị đã được cập nhật",
        });
      } catch (error: any) {
        toast({
          title: "Lỗi",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const project of projects) {
        if (project.id) {
          await supabase
            .from("projects")
            .update(project)
            .eq("id", project.id);
        } else {
          await supabase.from("projects").insert(project);
        }
      }
      toast({
        title: "✓ Đã lưu",
        description: "Tất cả dự án đã được cập nhật",
      });
      fetchProjects();
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
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quản lý Dự án</CardTitle>
              <CardDescription>Thêm và chỉnh sửa các dự án của bạn</CardDescription>
            </div>
            <Button onClick={addProject} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm dự án
            </Button>
          </div>
        </CardHeader>
      </Card>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Chưa có dự án nào</h3>
            <p className="text-muted-foreground mb-4">
              Bắt đầu bằng cách thêm dự án đầu tiên của bạn
            </p>
            <Button onClick={addProject} className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm dự án đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={projects.map((p) => p.id || "")} strategy={verticalListSortingStrategy}>
              <div className="space-y-6">
                {projects.map((project, index) => (
                  <SortableProjectItem
                    key={project.id || index}
                    project={project}
                    index={index}
                    updateProject={updateProject}
                    removeProject={removeProject}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={fetchProjects}>
              Hủy thay đổi
            </Button>
            <Button onClick={handleSave} disabled={saving} size="lg" className="gap-2 px-8">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Lưu tất cả
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

interface SortableProjectItemProps {
  project: Project;
  index: number;
  updateProject: (index: number, field: keyof Project, value: any) => void;
  removeProject: (index: number) => void;
}

const SortableProjectItem = ({ project, index, updateProject, removeProject }: SortableProjectItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id || "" });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="shadow-card hover:shadow-card-hover transition-all">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mt-1">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">
                  {project.title || `Dự án ${index + 1}`}
                </h3>
                {project.featured && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Nổi bật
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Thứ tự hiển thị: {index + 1}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeProject(index)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Image Preview */}
        {project.image_url && (
          <div className="relative aspect-video rounded-lg overflow-hidden border">
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`title-${index}`}>Tên dự án</Label>
            <Input
              id={`title-${index}`}
              value={project.title}
              onChange={(e) => updateProject(index, "title", e.target.value)}
              placeholder="VD: Website Thương mại điện tử"
              className="h-11"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`description-${index}`}>Mô tả</Label>
            <Textarea
              id={`description-${index}`}
              value={project.description}
              onChange={(e) => updateProject(index, "description", e.target.value)}
              rows={3}
              placeholder="Mô tả chi tiết về dự án..."
              className="resize-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`image-${index}`} className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Hình ảnh URL
            </Label>
            <Input
              id={`image-${index}`}
              value={project.image_url}
              onChange={(e) => updateProject(index, "image_url", e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`demo-${index}`} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Demo URL
            </Label>
            <Input
              id={`demo-${index}`}
              value={project.demo_url}
              onChange={(e) => updateProject(index, "demo_url", e.target.value)}
              placeholder="https://demo.example.com"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`github-${index}`} className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub URL
            </Label>
            <Input
              id={`github-${index}`}
              value={project.github_url}
              onChange={(e) => updateProject(index, "github_url", e.target.value)}
              placeholder="https://github.com/username/repo"
              className="h-11"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`technologies-${index}`}>Công nghệ sử dụng</Label>
            <Input
              id={`technologies-${index}`}
              value={project.technologies.join(", ")}
              onChange={(e) =>
                updateProject(
                  index,
                  "technologies",
                  e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                )
              }
              placeholder="React, TypeScript, Tailwind CSS (phân cách bằng dấu phẩy)"
              className="h-11"
            />
            {project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {project.technologies.map((tech, i) => (
                  <Badge key={i} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:col-span-2">
            <Switch
              id={`featured-${index}`}
              checked={project.featured}
              onCheckedChange={(checked) => updateProject(index, "featured", checked)}
            />
            <Label htmlFor={`featured-${index}`} className="cursor-pointer">
              Đánh dấu là dự án nổi bật
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsEditor;