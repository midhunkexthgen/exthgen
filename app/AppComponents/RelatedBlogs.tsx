"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Blog {
  id: number;
  blogTitle: string;
  blogDescription: string;
  Author: string;
  blogContent: any;
  createdAt: string;
  blogCoverImage: { url: string };
}

// Add revalidation configuration
export const revalidate = 3600; 
const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;


async function getBlogs(): Promise<Blog[]> {
  try {
    const res = await fetch(
      `${baseUrl}/api/blogs/?populate=*`,
      {
        next: { revalidate: 3600 }, 
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch blogs");
    }

    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
}

export default function RelatedBlogs() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  
  // Function to handle blog click
  const handleBlogClick = (blogId: number) => {
    // Navigate to the blog detail page
    router.push(`/blogs-details/${blogId}`);
    
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Use React's useEffect to fetch blogs on the client side
  useEffect(() => {
    const fetchBlogs = async () => {
      const blogsData = await getBlogs();
      setBlogs(blogsData);
    };
    
    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-4xl font-light text-center mb-12 font-hedvig-serif">
        Related blogs
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-8">
        {blogs.slice(0, 3).map((card: Blog, index: number) => (
          <div
            key={index}
            className="flex flex-col rounded-[30px] overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handleBlogClick(card.id)}
          >
            <div className="h-64 overflow-hidden">
              <img
                src={`${baseUrl}${card?.blogCoverImage?.url}`}
                alt={`Blog ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col gap-3">
              <h3 className="text-xl text-[#1F2937] font-hedvig-serif">
                {card.blogTitle}
              </h3>
              <p className="text-[#374151] font-extralight">
                {card.blogDescription}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}