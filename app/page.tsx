import { Hero } from "@/components/sections/Hero";
import { AboutSection } from "@/components/sections/AboutSection";
import { Expertise } from "@/components/sections/Expertise";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ArchitectureGallery } from "@/components/sections/ArchitectureGallery";
import { TechStack } from "@/components/sections/TechStack";
import { LatestArticles } from "@/components/sections/LatestArticles";
import { ContactSection } from "@/components/sections/ContactSection";
import { getAllArticles } from "@/lib/articles";
import { getAllProjects } from "@/lib/projects";

export default function HomePage() {
  const allArticles = getAllArticles();
  const allProjects = getAllProjects();
  const latestArticles = allArticles.slice(0, 5);

  return (
    <>
      <Hero articleCount={allArticles.length} projectCount={allProjects.length} />
      <AboutSection />
      <Expertise />
      <FeaturedProjects />
      <ArchitectureGallery />
      <TechStack />
      <LatestArticles articles={latestArticles} />
      <ContactSection />
    </>
  );
}
