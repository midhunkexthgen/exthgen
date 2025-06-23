"use client";
import { useResponsive } from "@/hooks/useResponsive";
import { FaArrowRightLong } from "react-icons/fa6";
import MenuItems from "../../AppComponents/MenuItems";
import { ProjectCard } from "../../AppComponents/PojectList";
import BuyMeACoffee from "../../AppComponents/BuyMeACoffee";
import Image from "next/image";
import Link from "next/link";

// Define the Portfolio and Project interfaces
interface Portfolio {
  id: number;
  portfolioTitle: string;
  portfolioDescription: string;
  detailDescription: string;
  portfolioContent: any;
  createdAt: string;
  portfolioCoverImage: { url: string; name: string };
  portfolioFeatures: string[];
  portfolioImages: { url: string; name: string; id: number }[];
  projectDuration: string;
  projectImpact: string;
  projectClient: string;
  projectType: string;
  duration: string;
  impact: string;
  url: string;
}

interface Project {
  image: { url: string; name: string };
  name: string;
  tags: string[];
  id: number;
}

interface PortfolioContentProps {
  projects: Project[];
  currentPortfolio: Portfolio;
}

const PortfolioContent: React.FC<PortfolioContentProps> = ({
  projects,
  currentPortfolio,
}) => {
  const isMobile = useResponsive();
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;



  // Format the date
  const formattedDate = new Date(currentPortfolio.createdAt).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="flex flex-col bg-white w-full relative overflow-hidden">
      {/* Background Video with Light Overlay */}
      <div className="absolute inset-0 w-full h-[100vh] z-0 overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-70 z-10"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/video-poster.jpg"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
        >
          <source src="/ripple2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Header */}
      <div className="flex md:pl-20 pl-6 md:py-5 py-3 justify-between relative z-20">
        <Image
          src="/Logo/exthgen.svg"
          alt="Site Logo"
          className="w-24 md:w-32 h-auto mb-6"
          width={128}
          height={40}
        />
        <MenuItems />
      </div>

      {/* Title Section */}
      <div className="flex flex-col justify-center items-center pt-12 pb-16 md:pb-32 relative">
        <h1 className="text-center text-[30px] md:text-[64px] leading-[38px] md:leading-[80px] font-normal font-hedvig-serif">
          {currentPortfolio.portfolioTitle}
        </h1>

        {/* Tags */}
        <div className="flex gap-4 mt-6 font-light flex-wrap justify-center">
          {(
            Object.values(currentPortfolio?.portfolioFeatures || {}) as string[]
          ).map((feature, idx) => (
            <div
              key={idx}
              className="text-xs font-light bg-white px-3 py-2 shadow-xl rounded-full"
            >
              <p>{feature}</p>
            </div>
          ))}
        </div>

        {/* Description - Mobile View */}
        <div className="md:hidden px-6 mt-8 mb-8">
          <p className="text-center font-light leading-relaxed">
            {currentPortfolio.portfolioDescription}
          </p>
        </div>

        {/* Buttons - Mobile View */}
        <div className="md:hidden flex items-center justify-center space-x-4 font-visby">
          {/* {currentPortfolio.url && (
            <Link
              href={currentPortfolio.url}
              target="_blank"
              className="bg-exthgen-gradient font-hedvig-serif text-white py-3 px-6 hover:bg-pink-600 cursor-pointer rounded-full text-sm font-bold leading-6 flex items-center"
            >
              Checkout <FaArrowRightLong className="ml-2" />
            </Link>
          )} */}
          <button className="bg-exthgen-gradient font-hedvig-serif text-white py-3 px-6 hover:bg-pink-600 cursor-pointer rounded-full text-sm font-bold leading-6 flex items-center">
            Checkout <FaArrowRightLong className="ml-2" />
          </button>
          <Link
            href="/contact"
            className="bg-transparent font-hedvig-serif text-black border border-[#1E2028] py-3 px-6 cursor-pointer rounded-full text-sm font-bold leading-6 flex items-center"
          >
            Contact
          </Link>
        </div>
      </div>

      {/* Description Card - Desktop View */}
      <div className="hidden md:block relative max-w-3xl mx-auto px-4">
        <div className="overflow-hidden -mt-32 text-center px-12 py-10">
          <p className="text-2xl leading-relaxed font-light mt-2 mb-8 text-[#323442]">
            {currentPortfolio.portfolioDescription}
          </p>
          <div className="flex items-center justify-center space-x-4 font-visby">
            {/* {currentPortfolio.url && (
              <Link
                href={currentPortfolio.url}
                target="_blank"
                className="bg-exthgen-gradient font-hedvig-serif text-white py-3 px-6 hover:bg-pink-600 cursor-pointer rounded-full text-sm font-bold leading-6 flex items-center"
              >
                Checkout <FaArrowRightLong className="ml-2" />
              </Link>
            )} */}
            <Link href="/GetInTouch" className="bg-exthgen-gradient font-hedvig-serif text-white py-3 px-6 hover:bg-pink-600 cursor-pointer rounded-full text-sm font-bold leading-6 flex items-center">
              Checkout <FaArrowRightLong className="ml-2" />
            </Link>
            <Link
              href="/GetInTouch"
              className="bg-transparent font-hedvig-serif text-black border border-[#1E2028] py-3 px-6 cursor-pointer rounded-full text-sm font-bold leading-6 flex items-center"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* App Image Section */}
      <div className="relative mt-6 md:mt-18 pb-0 flex flex-col  md:px-20 lg:px-40 mx-auto gap-[100px] pb-16">
        {/* Main Portfolio Image */}
        <div
          className={`relative mt-0 ${
            isMobile ? "w-full aspect-square px-3" : "w-full"
          }`}
        >
          <Image
            src={`${baseUrl}${currentPortfolio.portfolioCoverImage.url}`}
            alt={currentPortfolio.portfolioCoverImage.name}
            className={`rounded-[32px] object-cover ${
              isMobile ? "w-full aspect-square" : "w-full"
            }`}
            width={0}
            height={0}
            layout="responsive"
          />
        </div>

        {/* Project Info Section */}
        <div
          className={`relative w-full grid grid-cols-2 md:grid-cols-4 text-center md:text-center items-center justify-center place-items-center ${
            isMobile ? "gap-4" : ""
          }`}
        >
          <div
            className={`flex flex-col items-center justify-center ${
              isMobile ? "gap-0" : "gap-3"
            }`}
          >
            <h4 className="text-black text-lg md:text-xl">Project</h4>
            <p className="text-black text-sm font-light">
              {currentPortfolio.projectType}
            </p>
          </div>
          <div
            className={`flex flex-col items-center justify-center ${
              isMobile ? "gap-0" : "gap-3"
            }`}
          >
            <h4 className="text-black text-lg md:text-xl">Client</h4>
            <p className="text-black text-sm font-light">
              {currentPortfolio.projectClient || "Client Name"}
            </p>
          </div>
          <div
            className={`flex flex-col items-center justify-center ${
              isMobile ? "gap-0" : "gap-3"
            }`}
          >
            <h4 className="text-black text-lg md:text-xl">Duration</h4>
            <p className="text-black text-sm font-light">
              {currentPortfolio.projectDuration || "Project Duration"}
            </p>
          </div>
          <div
            className={`flex flex-col items-center justify-center ${
              isMobile ? "gap-0" : "gap-3"
            }`}
          >
            <h4 className="text-black text-lg md:text-xl">Impact</h4>
            <p className="text-black text-sm font-light">
              {currentPortfolio.projectImpact || "Project Impact"}
            </p>
          </div>
        </div>

        <div
          className={`relative ${
            isMobile ? "w-full aspect-square px-3" : "w-full"
          }`}
        >
          <Image
            src={`${baseUrl}${currentPortfolio.portfolioImages[0].url}`}
            alt={currentPortfolio.portfolioImages[0].name}
            className={`rounded-[32px] object-cover ${
              isMobile ? "w-full aspect-square" : "w-full"
            }`}
            width={0}
            height={0}
            layout="responsive"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
          <div className="w-full md:w-[50%]"></div>
          <div className="w-full md:w-[50%] font-light text-lg md:text-2xl text-[#1E2028] px-4 md:px-0">
            <p>{currentPortfolio.detailDescription || "Project Description"}</p>
          </div>
        </div>

        {currentPortfolio?.portfolioImages.slice(1).map((image, index) => (
          <div
            key={index}
            className={`relative ${
              isMobile ? "w-full aspect-square px-3" : "w-full"
            }`}
          >
              <Image
                src={`${baseUrl}${image.url}`}
                alt={image.name}
                className={`rounded-[32px] object-cover ${
                  isMobile ? "w-full aspect-square" : "w-full"
                }`}
                width={0}
                height={0}
                layout="responsive"
              />
          </div>
        ))}

        {/* Latest Projects */}
        {projects && projects.length > 0 && (
          <div>
            <div className="flex items-center justify-center pb-4 text-[#A7ACC1] gap-4 text-2xl font-normal decoration-neutral-400">
              <div className="w-20 h-px bg-gradient-to-l from-neutral-400 to-transparent ml-4"></div>
              <h1 className="font-light">See Also</h1>
              <div className="w-20 h-px bg-gradient-to-r from-neutral-400 to-transparent mr-4"></div>
            </div>
            <div>
              <div className="text-center pb-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-light font-hedvig-serif mb-3">
                  Latest{" "}
                  <span className="bg-gradient-to-r from-[#FD169C] via-[#FE497A] to-[#FE7B59] bg-clip-text text-transparent">
                    Projects
                  </span>
                </h1>
              </div>
              <div
                className={`flex flex-col md:flex-row justify-between gap-8 ${
                  isMobile ? "px-4" : ""
                }`}
              >
                {projects.map((project, index) => (
                  <ProjectCard
                    key={index}
                    image={project.image}
                    name={project.name}
                    tags={project.tags}
                    id={project.id}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <BuyMeACoffee url="../footer-vid.mp4" />
    </div>
  );
};

export default PortfolioContent;
