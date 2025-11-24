import { useEffect, useState } from "react";
import { supabase } from "@root/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter, Mail, MapPin, Phone } from "lucide-react";

interface Profile {
  full_name: string;
  title: string;
  bio: string;
  avatar_url?: string;
  email?: string;
  phone?: string;
  location?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
}

const Hero = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data } = await supabase.from("profile").select("*").single();
    if (data) {
      setProfile({
        full_name: data.full_name || "",
        title: data.title || "",
        bio: data.bio || "",
        avatar_url: data.avatar_url ?? undefined,
        email: data.email ?? undefined,
        phone: data.phone ?? undefined,
        location: data.location ?? undefined,
        github_url: data.github_url ?? undefined,
        linkedin_url: data.linkedin_url ?? undefined,
        twitter_url: data.twitter_url ?? undefined,
        website_url: data.website_url ?? undefined,
      });
    }
  };

  if (!profile) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-hero text-primary-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-foreground mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-hero text-primary-foreground px-4 py-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {profile.avatar_url && (
          <div className="flex justify-center mb-8 animate-scale-in">
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-32 h-32 rounded-full object-cover border-4 border-primary-foreground/20 hover:scale-110 transition-transform duration-500 hover:border-primary-foreground/40 shadow-lg"
            />
          </div>
        )}

        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight hover:scale-105 transition-transform duration-300">
            {profile.full_name}
          </h1>
          <p className="text-2xl md:text-3xl text-primary-foreground/90 font-light animate-fade-in" style={{ animationDelay: "200ms" }}>
            {profile.title}
          </p>
        </div>

        {profile.bio && (
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "300ms" }}>
            {profile.bio}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-primary-foreground/80 animate-fade-in" style={{ animationDelay: "400ms" }}>
          {profile.location && (
            <div className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
              <MapPin className="h-4 w-4" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.email && (
            <div className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
              <Mail className="h-4 w-4" />
              <span>{profile.email}</span>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
              <Phone className="h-4 w-4" />
              <span>{profile.phone}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 pt-4 animate-fade-in" style={{ animationDelay: "500ms" }}>
          {profile.github_url && (
            <Button variant="outline" size="icon" asChild className="bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 hover:scale-110 hover:-translate-y-1 transition-all duration-300">
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>
          )}
          {profile.linkedin_url && (
            <Button variant="outline" size="icon" asChild className="bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 hover:scale-110 hover:-translate-y-1 transition-all duration-300">
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
          )}
          {profile.twitter_url && (
            <Button variant="outline" size="icon" asChild className="bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 hover:scale-110 hover:-translate-y-1 transition-all duration-300">
              <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-primary-foreground/60">
          <span className="text-xs font-medium">Cuộn xuống</span>
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
