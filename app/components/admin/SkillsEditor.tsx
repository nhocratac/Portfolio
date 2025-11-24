import { useState, useEffect } from "react";
import { supabase } from "@root/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, Save, Award, GripVertical } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Skill {
  id?: string;
  name: string;
  category: string;
  level: number;
  display_order: number;
}

const SkillsEditor = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("skills")
        .select("*")
        .order("category")
        .order("display_order", { ascending: true });
      if (data) setSkills(data);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    setSkills([
      ...skills,
      {
        name: "",
        category: "",
        level: 50,
        display_order: skills.length,
      },
    ]);
  };

  const removeSkill = async (index: number) => {
    const skill = skills[index];
    if (skill.id) {
      await supabase.from("skills").delete().eq("id", skill.id);
      toast({
        title: "Đã xóa",
        description: "Kỹ năng đã được xóa",
      });
    }
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkill = (index: number, field: keyof Skill, value: any) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    setSkills(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const skill of skills) {
        if (skill.id) {
          await supabase.from("skills").update(skill).eq("id", skill.id);
        } else {
          await supabase.from("skills").insert(skill);
        }
      }
      toast({
        title: "✓ Đã lưu",
        description: "Tất cả kỹ năng đã được cập nhật",
      });
      fetchSkills();
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = skills.findIndex((item) => item.id === active.id);
      const newIndex = skills.findIndex((item) => item.id === over.id);

      const newSkills = arrayMove(skills, oldIndex, newIndex).map((skill, index) => ({
        ...skill,
        display_order: index,
      }));

      setSkills(newSkills);

      // Update display_order in database
      for (const skill of newSkills) {
        if (skill.id) {
          await supabase
            .from("skills")
            .update({ display_order: skill.display_order })
            .eq("id", skill.id);
        }
      }

      toast({ title: "Đã cập nhật thứ tự hiển thị" });
    }
  };

  // Group skills by category for preview
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

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
              <CardTitle>Quản lý Kỹ năng</CardTitle>
              <CardDescription>Thêm và chỉnh sửa các kỹ năng chuyên môn</CardDescription>
            </div>
            <Button onClick={addSkill} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm kỹ năng
            </Button>
          </div>
        </CardHeader>
        {Object.keys(groupedSkills).length > 0 && (
          <CardContent>
            <div className="space-y-4">
              <Label className="text-sm font-medium">Preview nhóm theo danh mục:</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                  <div key={category} className="p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">{category}</h4>
                    <div className="flex flex-wrap gap-1">
                      {categorySkills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {skills.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Chưa có kỹ năng nào</h3>
            <p className="text-muted-foreground mb-4">
              Bắt đầu bằng cách thêm kỹ năng đầu tiên của bạn
            </p>
            <Button onClick={addSkill} className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm kỹ năng đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={skills.filter(s => s.id).map(s => s.id!)} strategy={verticalListSortingStrategy}>
              {skills.map((skill, index) =>
                skill.id ? (
                  <SortableSkillItem
                    key={skill.id}
                    skill={skill}
                    index={index}
                    onUpdate={updateSkill}
                    onRemove={removeSkill}
                  />
                ) : (
                  <Card key={index} className="shadow-card hover:shadow-card-hover transition-all">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">
                              {skill.name || `Kỹ năng ${index + 1}`}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {skill.category || "Chưa có danh mục"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSkill(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`name-${index}`}>Tên kỹ năng</Label>
                            <Input
                              id={`name-${index}`}
                              value={skill.name}
                              onChange={(e) => updateSkill(index, "name", e.target.value)}
                              placeholder="VD: React, TypeScript"
                              className="h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`category-${index}`}>
                              Danh mục
                              <span className="text-xs text-muted-foreground ml-2">
                                (VD: Frontend, Backend, Tools)
                              </span>
                            </Label>
                            <Input
                              id={`category-${index}`}
                              value={skill.category}
                              onChange={(e) => updateSkill(index, "category", e.target.value)}
                              placeholder="Frontend"
                              className="h-11"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Mức độ thành thạo</Label>
                            <Badge variant="secondary" className="tabular-nums">
                              {skill.level}%
                            </Badge>
                          </div>
                          <Slider
                            value={[skill.level]}
                            onValueChange={(value) => updateSkill(index, "level", value[0])}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Beginner</span>
                            <span>Intermediate</span>
                            <span>Expert</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </SortableContext>
          </DndContext>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={fetchSkills}>
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
        </div>
      )}
    </div>
  );
};

interface SortableSkillItemProps {
  skill: Skill;
  index: number;
  onUpdate: (index: number, field: keyof Skill, value: any) => void;
  onRemove: (index: number) => void;
}

const SortableSkillItem = ({ skill, index, onUpdate, onRemove }: SortableSkillItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: skill.id!,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="shadow-card hover:shadow-card-hover transition-all">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <button
              className="cursor-grab active:cursor-grabbing mt-1 text-muted-foreground hover:text-foreground"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {skill.name || `Kỹ năng ${index + 1}`}
              </h3>
              <p className="text-sm text-muted-foreground">
                {skill.category || "Chưa có danh mục"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`name-${index}`}>Tên kỹ năng</Label>
              <Input
                id={`name-${index}`}
                value={skill.name}
                onChange={(e) => onUpdate(index, "name", e.target.value)}
                placeholder="VD: React, TypeScript"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`category-${index}`}>
                Danh mục
                <span className="text-xs text-muted-foreground ml-2">
                  (VD: Frontend, Backend, Tools)
                </span>
              </Label>
              <Input
                id={`category-${index}`}
                value={skill.category}
                onChange={(e) => onUpdate(index, "category", e.target.value)}
                placeholder="Frontend"
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Mức độ thành thạo</Label>
              <Badge variant="secondary" className="tabular-nums">
                {skill.level}%
              </Badge>
            </div>
            <Slider
              value={[skill.level]}
              onValueChange={(value) => onUpdate(index, "level", value[0])}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsEditor;
