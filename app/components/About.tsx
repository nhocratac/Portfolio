import { useEffect, useState } from "react";
import { supabase } from "@root/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, GraduationCap, Calendar, MapPin } from "lucide-react";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

const About = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [eduData, expData] = await Promise.all([
      supabase.from("education").select("*").order("start_date", { ascending: false }),
      supabase.from("experience").select("*").order("start_date", { ascending: false }),
    ]);

    if (eduData.data) {
      const mappedEducation = eduData.data.map(edu => ({
        ...edu,
        field_of_study: edu.field_of_study ?? undefined,
        end_date: edu.end_date ?? undefined,
        description: edu.description ?? undefined,
      }));
      setEducation(mappedEducation);
    }

    if (expData.data) {
      const mappedExperience = expData.data.map(exp => ({
        ...exp,
        location: exp.location ?? undefined,
        end_date: exp.end_date ?? undefined,
        description: exp.description ?? undefined,
      }));
      setExperience(mappedExperience);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
  };

  if (education.length === 0 && experience.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Về tôi</h2>
          <p className="text-muted-foreground text-lg">
            Hành trình học tập và kinh nghiệm làm việc của tôi
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Experience Section */}
          {experience.length > 0 && (
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Kinh nghiệm làm việc</h3>
              </div>

              <div className="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {experience.map((exp, index) => (
                  <Card
                    key={exp.id}
                    className="relative pl-12 shadow-card hover:shadow-card-hover hover:-translate-y-2 hover:scale-105 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <div className="absolute left-3 top-6 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg animate-scale-in" style={{ animationDelay: `${(index + 1) * 150}ms` }}>
                      <div className="w-3 h-3 rounded-full bg-primary-foreground" />
                    </div>

                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <h4 className="text-xl font-bold">{exp.position}</h4>
                        <p className="text-primary font-medium">{exp.company}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : "Hiện tại"}
                            </span>
                          </div>
                          {exp.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{exp.location}</span>
                            </div>
                          )}
                        </div>

                        {exp.description && (
                          <p className="text-muted-foreground mt-3 leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {education.length > 0 && (
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Học vấn</h3>
              </div>

              <div className="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {education.map((edu, index) => (
                  <Card
                    key={edu.id}
                    className="relative pl-12 shadow-card hover:shadow-card-hover hover:-translate-y-2 hover:scale-105 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <div className="absolute left-3 top-6 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg animate-scale-in" style={{ animationDelay: `${(index + 1) * 150}ms` }}>
                      <div className="w-3 h-3 rounded-full bg-primary-foreground" />
                    </div>

                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <h4 className="text-xl font-bold">{edu.degree}</h4>
                        {edu.field_of_study && (
                          <p className="text-primary font-medium">{edu.field_of_study}</p>
                        )}
                        <p className="font-medium">{edu.institution}</p>

                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(edu.start_date)} - {edu.end_date ? formatDate(edu.end_date) : "Hiện tại"}
                          </span>
                        </div>

                        {edu.description && (
                          <p className="text-muted-foreground mt-3 leading-relaxed">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
