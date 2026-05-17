import { Hero } from "@/components/sections/Hero";
import { Expertise } from "@/components/sections/Expertise";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { LatestArticles } from "@/components/sections/LatestArticles";
import { getFeaturedProjects } from "@/lib/projects";
import { getAllArticles } from "@/lib/articles";

export default function HomePage() {
  const featuredProjects = getFeaturedProjects();
  const latestArticles = getAllArticles().slice(0, 5);

  return (
    <>
      <Hero />
      <Expertise />
      <FeaturedProjects projects={featuredProjects} />
      <LatestArticles articles={latestArticles} />
    </>
  );
}
