"use client";

import { FaArrowRightLong } from "react-icons/fa6";
import MenuItems from "./MenuItems";
import logo from "../Assets/exthgen.svg";
import Image from "next/image";
import Link from "next/link";

const Vision = () => {

  return (
    <div className="flex flex-col bg-[#E8ECEE] w-full relative overflow-hidden">
      {/* Background Video with Red Overlay */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-70 z-10"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
        >
          {/* <source src="./path/to/your/background-video.mp4" type="video/mp4" /> */}
          <source src="/multiple_ripple.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="flex md:pl-20 pl-6 md:py-5 py-3 justify-between relative ">
        <Image
          src={logo}
          alt="Site Logo"
          className="w-24 md:w-32 h-auto mb-6"
          height={0}
          width={0}
        />
        <MenuItems />
      </div>

      <div className="flex flex-col justify-center items-center pb-32 pt-12 relative ">
        <h1 className="flex text-center md:text-[64px] text-[30px] md:leading-[80px] leading-[38px] font-normal font-hedvig-serif">
          Vision Matters
        </h1>

        {/* <div className="md:hidden">
          <p className="text-lg leading-relaxed text-center font-normal mt-4 px-4">
            We love working with small and medium businesses, helping them grow
            with tech that just works. Our goal is to keep things simple,
            scalable, and useful so every business, no matter how small, can
            reach its full potential. Together, let's grow, succeed, and build
            something amazing.
          </p>
          <div className="mt-8 flex justify-center space-x-4 font-visby">
            <button className="bg-exthgen-gradient text-white py-3 px-6 hover:bg-pink-600 rounded-full text-base font-bold leading-6 flex items-center">
              Free Brainstorm <FaArrowRightLong className="ml-2" />
            </button>
          </div>
        </div> */}
      </div>

      <div className=" md:flex flex-col items-center justify-center bg-white relative  pb-[3.25rem]">
        <div className="max-w-3xl px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="bg-white rounded-[36px] shadow-lg overflow-hidden -mt-20 ">
            <div className="px-10 md:px-20 py-8 flex flex-col justify-center items-center">
              <div className="flex justify-center items-center ">
                <video
                  src="/tree-vid.mp4"
                  className="max-w-full h-[150px] rounded-full bg-transparent"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <p className="text-sm md:text-lg leading-relaxed text-center font-normal">
                We love working with small and medium businesses, helping them
                grow with tech that just works. Our goal is to keep things
                simple, scalable, and useful so every business, no matter how
                small, can reach its full potential. Together, let's grow,
                succeed, and build something amazing.
              </p>
              <div className="mt-8 flex justify-center space-x-4 font-visby">
                <Link href={"/GetInTouch"} className="bg-exthgen-gradient text-white py-3 px-6 hover:bg-pink-600 rounded-full text-xs md:text-base font-bold leading-6 flex items-center">
                  Join Us <FaArrowRightLong className="ml-2" />
                </Link>
                <Link href={"/GetInTouch"} className="bg-white text-gray-800 py-3 px-6 border border-gray-300 hover:bg-gray-100 rounded-full text-xs md:text-base font-bold leading-6">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vision;
