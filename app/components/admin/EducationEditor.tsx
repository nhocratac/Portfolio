import { useEffect, useState } from "react";
import { supabase } from "@root/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Trash2, GraduationCap, GripVertical } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
  description?: string;
  display_order: number;
}

const EducationEditor = () => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Education>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    const { data } = await supabase
      .from("education")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) {
      const mappedEducations = data.map(edu => ({
        id: edu.id,
        institution: edu.institution,
        degree: edu.degree,
        field_of_study: edu.field_of_study ?? undefined,
        start_date: edu.start_date,
        end_date: edu.end_date ?? undefined,
        description: edu.description ?? undefined,
        display_order: edu.display_order ?? 0,
      }));
      setEducations(mappedEducations);
    }
  };

  const handleSave = async () => {
    if (!formData.institution || !formData.degree || !formData.start_date) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("education")
        .update(formData)
        .eq("id", editingId);

      if (!error) {
        toast({ title: "Đã cập nhật học vấn" });
        setEditingId(null);
        setFormData({});
        fetchEducations();
      }
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from("education")
        .insert([{
          user_id: session.user.id,
          institution: formData.institution!,
          degree: formData.degree!,
          field_of_study: formData.field_of_study,
          start_date: formData.start_date!,
          end_date: formData.end_date,
          description: formData.description,
          display_order: educations.length,
        }]);

      if (!error) {
        toast({ title: "Đã thêm học vấn mới" });
        setFormData({});
        fetchEducations();
      } else {
        toast({
          title: "Lỗi",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (!error) {
      toast({ title: "Đã xóa học vấn" });
      fetchEducations();
    }
  };

  const handleEdit = (education: Education) => {
    setEditingId(education.id);
    setFormData(education);
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
      const oldIndex = educations.findIndex((item) => item.id === active.id);
      const newIndex = educations.findIndex((item) => item.id === over.id);

      const newEducations = arrayMove(educations, oldIndex, newIndex);
      setEducations(newEducations);

      // Update display_order in database
      const updates = newEducations.map((edu, index) => ({
        id: edu.id,
        display_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from("education")
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
            <GraduationCap className="h-5 w-5" />
            {editingId ? "Chỉnh sửa học vấn" : "Thêm học vấn mới"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Trường/Đại học *</Label>
              <Input
                value={formData.institution || ""}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="VD: Đại học Bách Khoa Hà Nội"
              />
            </div>
            <div className="space-y-2">
              <Label>Bằng cấp *</Label>
              <Input
                value={formData.degree || ""}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="VD: Cử nhân"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Chuyên ngành</Label>
            <Input
              value={formData.field_of_study || ""}
              onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
              placeholder="VD: Khoa học máy tính"
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
            <Label>Mô tả</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Thành tích, hoạt động nổi bật..."
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
        <h3 className="text-lg font-semibold">Danh sách học vấn ({educations.length})</h3>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={educations.map(e => e.id)} strategy={verticalListSortingStrategy}>
            {educations.map((education) => (
              <SortableEducationItem
                key={education.id}
                education={education}
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

interface SortableEducationItemProps {
  education: Education;
  onEdit: (education: Education) => void;
  onDelete: (id: string) => void;
}

const SortableEducationItem = ({ education, onEdit, onDelete }: SortableEducationItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: education.id,
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
            <h4 className="font-bold text-lg">{education.degree}</h4>
            {education.field_of_study && (
              <p className="text-primary font-medium">{education.field_of_study}</p>
            )}
            <p className="text-muted-foreground">{education.institution}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(education.start_date).toLocaleDateString("vi-VN")} -{" "}
              {education.end_date ? new Date(education.end_date).toLocaleDateString("vi-VN") : "Hiện tại"}
            </p>
            {education.description && (
              <p className="text-sm text-muted-foreground mt-2">{education.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onEdit(education)} variant="outline" size="sm">
              Sửa
            </Button>
            <Button onClick={() => onDelete(education.id)} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationEditor;
