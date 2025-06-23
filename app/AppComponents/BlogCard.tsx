"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface BlogCardProps {
  blog: {
    id: number;
    blogTitle: string;
    blogDescription: string;
    Author: string;
    createdAt: string;
    blogCoverImage: { url: string };
  };
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const router = useRouter();

  return (
    <div className="w-full flex justify-between items-center gap-12 sm:gap-12 md:gap-18 lg:gap-24 xl:gap-32 flex-col md:flex-row lg:flex-row">
      <Image
        src={`${baseUrl}${blog.blogCoverImage.url}`}
        alt={blog.blogTitle}
        width={500}
        height={300}
        className="cursor-pointer rounded-3xl"
        onClick={() => router.push(`/blogs-details/${blog.id}`)}
      />
      <div className="flex flex-col gap-4 justify-start items-start">
        <h1 className="text-xl sm:text-2xl md:text-xl lg:text-4xl text-start font-light text-[#1E2028] font-hedvig-serif mb-3">
          {blog.blogTitle}
        </h1>
        <p className="text-start text-[#444444] text-sm sm:text-md md:text-sm lg:text-lg font-medium leading-9 gap-3 flex flex-col">
          {blog.Author} |{" "}
          {new Date(blog.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className="text-start text-[#323442] text-sm sm:text-lg md:text-sm lg:text-lg font-extralight leading-7 gap-3 text-[#323442] flex flex-col">
          {blog.blogDescription}
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
