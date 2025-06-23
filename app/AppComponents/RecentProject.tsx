// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// const RecentProjectPage = () => {

//   const projects = [
//     {
//       id: 1,
//       image: "queue.png",
//       name: "The Queue",
//       charecteristics: [
//         "Mobile Apps",
//         "Innovative Solutions",
//         "User Experience",
//       ],
//     },
//     {
//       id: 2,
//       image: "directify-2.png",
//       name: "Directify",
//       charecteristics: ["E-Commerce", "Web Development", "Responsive Design"],
//     },
//     {
//       id: 3,
//       image: "manifest.png",
//       name: "Money Manifest",
//       charecteristics: ["UI/UX", "Mobile App"],
//     },
//     {
//       id: 4,
//       image: "royalDrive.png",
//       name: "Royal Drive",
//       charecteristics: ["UI/UX", "Mobile App"],
//     },
//   ];

//   return (
//     <div className="bg-white py-1 md:py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-light font-hedvig-serif mb-3">
//             Our{" "}
//             <span className="bg-gradient-to-r from-[#FD169C] via-[#FE497A] to-[#FE7B59] bg-clip-text text-transparent">
//               Recent Projects
//             </span>
//           </h1>
//         </div>
//         <div className="flex flex-col justify-center gap-4 font-visby font-normal">
//           <p className="text-center text-[#323442] text-lg font-light leading-7 gap-3 flex flex-col">
//             Explore our diverse range of completed projects.
//           </p>
//         </div>
//         <div className="">
//           <div className="grid grid-cols-1 gap-8">
//             {projects.map((project, index) => (
//               <div key={index} className="flex flex-col items-center mt-16">
//                 <Link
//                   href={`/PortFolioDetails/${project.id}`}
//                   className={`relative w-full aspect-square md:aspect-video cursor-pointer`}
//                 >
//                   <div className="relative w-full h-full">
//                     <Image
//                       className={`rounded-[32px] object-cover w-full aspect-square md:aspect-video`}
//                       src={`/Projects/${project.image}`}
//                       alt={project.name}
//                       width={0}
//                       height={0}
//                       layout="responsive"
//                     />
//                   </div>
//                 </Link>
//                 <h3 className="mt-4 text-3xl font-normal font-hedvig-serif">
//                   {project.name}
//                 </h3>
//                 <div className="flex items-center gap-2 pt-5 flex-wrap justify-center">
//                   {project.charecteristics.map((characteristic, idx) => (
//                     <div
//                       key={idx}
//                       className="text-xs font-light bg-white px-3 py-2 shadow-xl rounded-full"
//                     >
//                       <p className="">{characteristic}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecentProjectPage;

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LoadingState from "@/components/shared/LoadingState";

// Define the Project interface
interface Project {
  id: number;
  portfolioTitle: string;
  portfolioDescription: string;
  portfolioContent: any;
  createdAt: string;
  portfolioCoverImage: { url: string, name: string };
  portfolioFeatures: string[];
  url: string;
}

const RecentProjectPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  console.log(baseUrl,"baseUrl");
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
    <div className="bg-white py-1 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-light font-hedvig-serif mb-3">
            Our{" "}
            <span className="bg-gradient-to-r from-[#FD169C] via-[#FE497A] to-[#FE7B59] bg-clip-text text-transparent">
              Recent Projects
            </span>
          </h1>
        </div>
        <div className="flex flex-col justify-center gap-4 font-visby font-normal">
          <p className="text-center text-[#323442] text-lg font-light leading-7 gap-3 flex flex-col">
            Explore our diverse range of completed projects.
          </p>
        </div>

        {isLoading && (
          <LoadingState />
        )}

        {error && (
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="">
            <div className="grid grid-cols-1 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col items-center mt-16"
                >
                  <Link
                    href={`/PortFolioDetails/${project.id}`}
                    className={`relative w-full aspect-square md:aspect-video cursor-pointer`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        className={`rounded-[32px] object-cover w-full aspect-square md:aspect-video`}
                        src={
                          project.portfolioCoverImage
                            ? `${baseUrl}${project.portfolioCoverImage.url}`
                            : "/placeholder.jpg"
                        }
                        alt={project.portfolioCoverImage.name}
                        width={0}
                        height={0}
                        layout="responsive"
                      />
                    </div>
                  </Link>
                  <h3 className="mt-4 text-3xl font-normal font-hedvig-serif">
                    {project.portfolioTitle}
                  </h3>
                  <div className="flex items-center gap-2 pt-5 flex-wrap justify-center">
                    {(
                      Object.values(
                        project?.portfolioFeatures || {}
                      ) as string[]
                    ).map((feature, idx) => (
                      <div
                        key={idx}
                        className="text-xs font-light bg-white px-3 py-2 shadow-xl rounded-full"
                      >
                        <p>{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentProjectPage;
