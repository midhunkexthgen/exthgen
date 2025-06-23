"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Project {
  id: number;
  portfolioTitle: string;
  portfolioDescription: string;
  portfolioContent: any;
  createdAt: string;
  portfolioCoverImage: { url: string; name: string };
  portfolioFeatures: string[];
  url: string;
}

function ProjectList() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${baseUrl}/api/portfolios/?populate=*`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await res.json();
        setProjects(data?.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20 py-12 pt-20 md:pt-40">
      <div className="max-w-2xl flex flex-col items-center justify-center mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-light font-hedvig-serif mb-4">
          The Latest{" "}
          <span className="bg-gradient-to-r from-[#FD169C] via-[#FE497A] to-[#FE7B59] bg-clip-text text-transparent">
            Ripples
          </span>
        </h1>
        <p className="text-xs md:text-lg text-center text-gray-500 mb-12">
          Where code meets craft and design speaks fluently — explore the latest
          wave we've launched into the digital sea.
        </p>
      </div>
      {isLoading && (
        <div className="text-center py-12">Loading projects...</div>
      )}
      {error && <div className="text-center py-12 text-red-500">{error}</div>}
      {!isLoading && !error && projects.length === 0 && (
        <div className="text-center py-12">No projects found</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-16 gap-x-24 max-w-7xl mx-auto">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            image={project.portfolioCoverImage}
            name={project.portfolioTitle}
            tags={project.portfolioFeatures}
            id={project.id}
          />
        ))}
      </div>
    </div>
  );
}

export const ProjectCard = ({
  image,
  name,
  tags,
  id,
}: {
  image: any;
  name: string;
  tags: string[];
  id: number;
}) => {
  const router = useRouter();

  // Safely construct the image URL
  const getImageUrl = () => {
    if (!image || !image.url) return "/placeholder.jpg";

    // Check if the URL is already absolute
    if (image.url.startsWith("http://") || image.url.startsWith("https://")) {
      return image.url;
    }

    // Ensure the URL doesn't have double slashes
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    const imageUrl = image.url.startsWith("/") ? image.url : `/${image.url}`;
    return `${baseUrl}${imageUrl}`;
  };

  const handleCardClick = () => {
    router.push(`/PortFolioDetails/${id}`);
  };

  return (
    <div className="flex flex-col w-full">
      <div
        className="rounded-3xl overflow-hidden w-full aspect-[3/2] md:aspect-[5/3] bg-gray-100 shadow-xl cursor-pointer"
        onClick={handleCardClick}
      >
        <Image
          src={getImageUrl()}
          alt={name || "Project image"}
          width={800}
          height={500}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-6 space-y-2 sm:space-y-0">
        <h3 className="text-lg sm:text-xl md:text-2xl font-light text-center sm:text-left">
          {name}
        </h3>
        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          {tags && Object.keys(tags).length > 0
            ? Object.values(tags).map((tag, index) => (
                <span
                  key={index}
                  className="bg-white shadow-md text-gray-700 px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
                >
                  {tag}
                </span>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
