"use client";

import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import FeaturedBlogs from "@/components/FeaturedBlogs";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "projects", "skills", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-sm animate-fade-in">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:scale-110 transition-transform duration-300">
            Portfolio
          </h1>

          <div className="hidden md:flex items-center gap-6">
            {[
              { id: "home", label: "Trang chủ" },
              { id: "about", label: "Về tôi" },
              { id: "projects", label: "Dự án" },
              { id: "skills", label: "Kỹ năng" },
              { id: "blog", label: "Blog" },
              { id: "contact", label: "Liên hệ" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-110 hover:-translate-y-0.5 ${activeSection === item.id ? "text-primary scale-105" : "text-muted-foreground"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div id="home">
        <Hero />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="projects">
        <Projects />
      </div>
      <div id="skills">
        <Skills />
      </div>
      <div id="blog">
        <FeaturedBlogs />
      </div>
      <div id="contact">
        <Contact />
      </div>

      <footer className="py-12 px-4 bg-card border-t">
        <div className="container mx-auto text-center space-y-4">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4">
            {[
              { id: "home", label: "Trang chủ" },
              { id: "about", label: "Về tôi" },
              { id: "projects", label: "Dự án" },
              { id: "skills", label: "Kỹ năng" },
              { id: "blog", label: "Blog" },
              { id: "contact", label: "Liên hệ" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
