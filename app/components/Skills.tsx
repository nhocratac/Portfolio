import { useEffect, useState } from "react";
import { supabase } from "@root/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
}

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("category")
      .order("display_order", { ascending: true });
    if (data) setSkills(data);
  };

  if (skills.length === 0) {
    return null;
  }

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section id="skills" className="py-20 px-4 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Kỹ năng</h2>
          <p className="text-muted-foreground text-lg">
            Công nghệ và công cụ tôi sử dụng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedSkills).map(([category, categorySkills], index) => (
            <Card
              key={category}
              className="shadow-card hover:shadow-card-hover hover:-translate-y-2 hover:scale-105 transition-all duration-300 animate-fade-in border-2 hover:border-primary/30"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categorySkills.map((skill, skillIndex) => (
                  <div key={skill.id} className="space-y-2 group/skill animate-fade-in" style={{ animationDelay: `${(index * 100) + (skillIndex * 50)}ms` }}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium group-hover/skill:text-primary transition-colors">{skill.name}</span>
                      <span className="text-sm text-muted-foreground font-semibold">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2 transition-all duration-500 group-hover/skill:h-3" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
