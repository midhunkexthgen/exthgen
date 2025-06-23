// import { FaArrowRightLong } from "react-icons/fa6";

// const TeamPage = () => {
//   const teamMembers = [
//     {
//       image: "saleeq-statue.png",
//       name: "Saleeq",
//       role: "Director of everything",
//     },
//     {
//       image: "shaheed-statue.png",
//       name: "Shaheed",
//       role: "Angel Richie",
//     },
//     {
//       image: "rishad-statue.png",
//       name: "Rishad",
//       role: "Tech Mavrerick",
//     },
//     {
//       image: "sana-statue.png",
//       name: "Sana",
//       role: "Design and Culture Curator",
//     },
//     {
//       image: "dilshad-statue.png",
//       name: "Dilshad",
//       role: "Cool Dev",
//     },
//     {
//       image: "nabeel-statue.png",
//       name: "Nabeel",
//       role: "Design and Culture Curator",
//     },
//     // {
//     //   image: "dilshad.png",
//     //   name: "Dilshad",
//     //   role: "Cool Dev",
//     // },

//     // {
//     //   image: "shahadil.png",
//     //   name: "Shahadil",
//     //   role: "DevOps Architect",
//     // },
//     // {
//     //   image: "sahal.png",
//     //   name: "Sahal",
//     //   role: "Master of Analytics and Discipline",
//     // },
//     // {
//     //   image: "afeefa.png",
//     //   name: "Afeefa",
//     //   role: "App Wizard",
//     // },
//     // {
//     //   image: "rafa.png",
//     //   name: "Rafath",
//     //   role: "Search Sorcerer",
//     // },
//     // {
//     //   image: "irshad.png",
//     //   name: "Irshad",
//     //   role: "Vibe Dev",
//     // },
//   ];

//   return (
//     <div className="bg-white py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-light font-hedvig-serif mb-9">
//             Our{" "}
//             <span className="bg-gradient-to-r from-[#FD169C] via-[#FE497A] to-[#FE7B59] bg-clip-text text-transparent">
//               Team
//             </span>
//           </h1>
//         </div>
//         <div className="mt-10">
//           <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
//             {teamMembers.map((member, index) => (
//               <div key={index} className="flex flex-col items-center">
//                 <img
//                   className={`w-96 h-72 rounded-[32px] object-cover  `}
//                   src={`./Team/${member.image}`}
//                   alt={member.name}
//                 />
//                 <h3 className="mt-4 text-2xl font-normal font-hedvig-serif">
//                   {member.name}
//                 </h3>
//                 <p className="text-base font-medium bg-gradient-to-r from-[#FD169C] via-[#FE497A] to-[#FE7B59] bg-clip-text text-transparent">{member.role}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-20 mb-24 flex space-x-4 font-visby justify-center">
//           <button className="bg-exthgen-gradient text-white py-3 px-6 hover:bg-pink-600 rounded-full text-base font-bold leading-6 flex items-center">
//             Join The Team <FaArrowRightLong className="ml-2" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeamPage;

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { FaArrowRightLong } from "react-icons/fa6";

// Move the interface to a separate types file
interface TeamMember {
  id: number;
  memberName: string;
  memberRole: string;
  memberImage: { url: string };
  order: number; // Added order field
}

// Add revalidation configuration
export const revalidate = 3600; // Revalidate every hour
const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;


async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const res = await fetch(`${baseUrl}/api/members/?populate=*`, {
      next: { revalidate: 3600 }, // Better way to handle caching
    });

    if (!res.ok) {
      throw new Error("Failed to fetch team members");
    }

    const data = await res.json();
    const members = data?.data || [];
    
    // Sort by order field
    return members.sort((a: TeamMember, b: TeamMember) => a.order - b.order);
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return [];
  }
}

export default async function TeamPage() {
  const teamMembers = await getTeamMembers();

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-light font-hedvig-serif mb-9">
            Our{" "}
            <span className="bg-gradient-to-r from-[#FD169C] via-[#FE497A] to-[#FE7B59] bg-clip-text text-transparent">
              Team
            </span>
          </h1>
        </div>
        <div className="mt-10">
          <Suspense fallback={<div>Loading team members...</div>}>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.length > 0
                ? teamMembers.map((member) => (
                    <div key={member.id} className="flex flex-col items-center">
                      <Image
                        className="w-96 h-72 rounded-[32px] object-cover"
                        src={
                          `${baseUrl}${member.memberImage.url}` ||
                          `./Team/default-profile.png`
                        }
                        alt={member.memberName}
                        width={0}
                        height={0}
                        layout="responsive"
                      />
                      <h3 className="mt-4 text-2xl font-normal font-hedvig-serif">
                        {member.memberName}
                      </h3>
                      <p className="text-base font-medium bg-gradient-to-r from-[#FD169C] via-[#FE497A] to-[#FE7B59] bg-clip-text text-transparent">
                        {member.memberRole}
                      </p>
                    </div>
                  ))
                : // Fallback to static data if API returns empty
                  [
                    {
                      id: 1,
                      name: "Saleeq",
                      role: "Director of everything",
                      image: { url: "./Team/saleeq-statue.png" },
                      order: 1,
                    },
                    {
                      id: 2,
                      name: "Shaheed",
                      role: "Angel Richie",
                      image: { url: "./Team/shaheed-statue.png" },
                      order: 2,
                    },
                    {
                      id: 3,
                      name: "Rishad",
                      role: "Tech Mavrerick",
                      image: { url: "./Team/rishad-statue.png" },
                      order: 3,
                    },
                    {
                      id: 4,
                      name: "Sana",
                      role: "Design and Culture Curator",
                      image: { url: "./Team/sana-statue.png" },
                      order: 4,
                    },
                    {
                      id: 5,
                      name: "Dilshad",
                      role: "Cool Dev",
                      image: { url: "./Team/dilshad-statue.png" },
                      order: 5,
                    },
                    {
                      id: 6,
                      name: "Nabeel",
                      role: "Design and Culture Curator",
                      image: { url: "./Team/nabeel-statue.png" },
                      order: 6,
                    },
                  ]
                    .sort((a, b) => a.order - b.order) // Sort static data by order too
                    .map((staticMember) => (
                      <div
                        key={staticMember.id}
                        className="flex flex-col items-center"
                      >
                        <img
                          className="w-96 h-72 rounded-[32px] object-cover"
                          src={staticMember.image.url}
                          alt={staticMember.name}
                        />
                        <h3 className="mt-4 text-2xl font-normal font-hedvig-serif">
                          {staticMember.name}
                        </h3>
                        <p className="text-base font-medium bg-gradient-to-r from-[#FD169C] via-[#FE497A] to-[#FE7B59] bg-clip-text text-transparent">
                          {staticMember.role}
                        </p>
                      </div>
                    ))}
            </div>
          </Suspense>
        </div>

        <div className="mt-20 mb-24 flex space-x-4 font-visby justify-center">
          <Link href={"/Careers"} className="bg-exthgen-gradient text-white py-3 px-6 hover:bg-pink-600 rounded-full text-base font-bold leading-6 flex items-center">
            Join The Team <FaArrowRightLong className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}