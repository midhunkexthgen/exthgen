import { Suspense } from "react";
import BlogHeader from "../AppComponents/BlogHeader";
import BlogList from "../AppComponents/BlogList";
import BuyMeACoffee from "../AppComponents/BuyMeACoffee";
import JoinUs from "../AppComponents/JoinUs";

// Move the interface to a separate types file
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
export const revalidate = 3600; // Revalidate every hour
const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;


async function getBlogs(): Promise<Blog[]> {
  try {
    const res = await fetch(
      `${baseUrl}/api/blogs/?populate=*`,
      {
        next: { revalidate: 3600 }, // Better way to handle caching
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

export default async function Blogs() {
  const blogs = await getBlogs();

  return (
    <div className="flex flex-col">
      <BlogHeader />
      <Suspense fallback={<div>Loading blogs...</div>}>
        <BlogList blogs={blogs} />
      </Suspense>
      <JoinUs />
      <BuyMeACoffee url="./footer-vid.mp4" />
    </div>
  );
}
