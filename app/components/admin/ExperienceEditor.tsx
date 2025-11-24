import { useEffect, useState } from "react";
import { supabase } from "@root/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Trash2, Briefcase, GripVertical } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description?: string;
  display_order: number;
}

const ExperienceEditor = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    const { data } = await supabase
      .from("experience")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setExperiences(data);
  };

  const handleSave = async () => {
    if (!formData.company || !formData.position || !formData.start_date) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("experience")
        .update(formData)
        .eq("id", editingId);

      if (!error) {
        toast({ title: "Đã cập nhật kinh nghiệm" });
        setEditingId(null);
        setFormData({});
        fetchExperiences();
      }
    } else {
      const { error } = await supabase
        .from("experience")
        .insert([{
          company: formData.company!,
          position: formData.position!,
          location: formData.location,
          start_date: formData.start_date!,
          end_date: formData.end_date,
          description: formData.description,
          display_order: experiences.length,
        }]);

      if (!error) {
        toast({ title: "Đã thêm kinh nghiệm mới" });
        setFormData({});
        fetchExperiences();
      }
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("experience").delete().eq("id", id);
    if (!error) {
      toast({ title: "Đã xóa kinh nghiệm" });
      fetchExperiences();
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingId(experience.id);
    setFormData(experience);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = experiences.findIndex((item) => item.id === active.id);
      const newIndex = experiences.findIndex((item) => item.id === over.id);

      const newExperiences = arrayMove(experiences, oldIndex, newIndex);
      setExperiences(newExperiences);

      // Update display_order in database
      const updates = newExperiences.map((exp, index) => ({
        id: exp.id,
        display_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from("experience")
          .update({ display_order: update.display_order })
          .eq("id", update.id);
      }

      toast({ title: "Đã cập nhật thứ tự hiển thị" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            {editingId ? "Chỉnh sửa kinh nghiệm" : "Thêm kinh nghiệm mới"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Công ty *</Label>
              <Input
                value={formData.company || ""}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="VD: FPT Software"
              />
            </div>
            <div className="space-y-2">
              <Label>Vị trí *</Label>
              <Input
                value={formData.position || ""}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="VD: Senior Developer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Địa điểm</Label>
            <Input
              value={formData.location || ""}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="VD: Hà Nội, Việt Nam"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ngày bắt đầu *</Label>
              <Input
                type="date"
                value={formData.start_date || ""}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Ngày kết thúc</Label>
              <Input
                type="date"
                value={formData.end_date || ""}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mô tả công việc</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả trách nhiệm và thành tựu..."
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {editingId ? "Cập nhật" : "Thêm mới"}
            </Button>
            {editingId && (
              <Button onClick={handleCancel} variant="outline">
                Hủy
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Danh sách kinh nghiệm ({experiences.length})</h3>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={experiences.map(e => e.id)} strategy={verticalListSortingStrategy}>
            {experiences.map((experience) => (
              <SortableExperienceItem
                key={experience.id}
                experience={experience}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

interface SortableExperienceItemProps {
  experience: Experience;
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
}

const SortableExperienceItem = ({ experience, onEdit, onDelete }: SortableExperienceItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: experience.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="shadow-card hover:shadow-card-hover transition-all">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <button
            className="cursor-grab active:cursor-grabbing mt-1 text-muted-foreground hover:text-foreground"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </button>
          <div className="flex-1 space-y-2">
            <h4 className="font-bold text-lg">{experience.position}</h4>
            <p className="text-primary font-medium">{experience.company}</p>
            {experience.location && (
              <p className="text-muted-foreground text-sm">{experience.location}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {new Date(experience.start_date).toLocaleDateString("vi-VN")} -{" "}
              {experience.end_date ? new Date(experience.end_date).toLocaleDateString("vi-VN") : "Hiện tại"}
            </p>
            {experience.description && (
              <p className="text-sm text-muted-foreground mt-2">{experience.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onEdit(experience)} variant="outline" size="sm">
              Sửa
            </Button>
            <Button onClick={() => onDelete(experience.id)} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceEditor;
