import { notFound } from "next/navigation";
import Image from "next/image";
import { CiFacebook } from "react-icons/ci";
import { SlSocialTwitter } from "react-icons/sl";
import { MdOutlineWhatsapp } from "react-icons/md";
import { FiYoutube } from "react-icons/fi";
import { CiLinkedin } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import MenuItems from "@/app/AppComponents/MenuItems";
import RelatedBlogs from "@/app/AppComponents/RelatedBlogs";
import BuyMeACoffee from "@/app/AppComponents/BuyMeACoffee";

interface Blog {
  id: number;
  blogTitle: string;
  blogDescription: string;
  Author: string;
  createdAt: string;
  blogContent: any;
  blogCoverImage: { url: string };
}

const socailMedia = [
  {
    icon: <CiFacebook />,
    link: "/",
    colour: "#3B5999",
  },
  {
    icon: <SlSocialTwitter />,
    link: "/",
    colour: "#55ACEE",
  },
  {
    icon: <MdOutlineWhatsapp />,
    link: "/",
    colour: "#3AAF85",
  },
  {
    icon: <FiYoutube />,
    link: "/",
    colour: "#BD081C",
  },
  {
    icon: <CiLinkedin />,
    link: "/",
    colour: "#0077B5",
  },
  {
    icon: <FaInstagram />,
    link: "/",
    colour: "#E4405F",
  },
];
const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;


// Fixed generateStaticParams function that fetches all blog IDs
export async function generateStaticParams() {
  try {
    // Fetch all blogs to get their IDs
    const res = await fetch(
      `${baseUrl}/api/blogs/?populate=*`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch blogs for static params");
    }

    const data = await res.json();
    const blogs = data?.data || [];

    // Return an array of objects with the 'id' property
    return blogs.map((blog: any) => ({
      id: blog.id.toString(), // Make sure ID is a string
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return []; // Return empty array as fallback
  }
}

export const revalidate = 3600;

async function getBlogDetail(id?: string): Promise<Blog | null> {
  try {
    const res = await fetch(
      `${baseUrl}/api/blogs/?populate=*`,
      {
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch blog");
    }

    const data = await res.json();
    return data?.data.filter((e: any) => e.id == id)[0] || null;
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return null;
  }
}

export default async function BlogDetail({
  params,
}: {
  params: { id: string };
}) {
  const blog = await getBlogDetail(params.id);

  if (!blog) {
    notFound();
  }



  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex flex-col bg-white w-full relative overflow-hidden">
        {/* Content */}
        <div className="flex md:pl-20 pl-6 md:py-5 py-3 justify-between relative z-20">
          <img
            src="../Logo/exthgen.svg"
            alt="Site Logo"
            className="w-24 md:w-32 h-auto mb-6"
          />
          <MenuItems />
        </div>

        <div className="flex flex-col gap-6 pb-24 pt-12 max-w-4xl mx-auto">
          <div className="flex justify-center items-center flex-col font-hedvig-serif">
            <h1 className="flex text-start md:text-[64px] text-[26px] md:leading-[84px] leading-[34px] font-light text-[#111827] px-3 md:px-3 lg:px-0">
              {blog?.blogTitle}
            </h1>
            <div className="flex flex-col justify-center gap-4 pt-6 font-visby font-normal w-full">
              <p className="text-start text-[#323442] text-lg font-medium leading-7 gap-3 flex flex-col px-3 md:px-3 lg:px-0">
                {blog?.Author} |{" "}
                {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-3 md:px-3 lg:px-0">
            {socailMedia.map((item, index) => (
              <div
                key={index}
                className={`flex items-center jyustify-center gap-4 text-2xl cursor-pointer p-2 shadow-md rounded-full transition-all duration-300`}
                style={{ color: item.colour }}
              >
                <a href={item.link}>{item.icon}</a>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Header */}

      {/* Content */}
      <div className="flex flex-col justify-center items-center gap-12 pb-12">
        <div className="max-w-4xl">
          <p className="text-[#323442] text-xl font-extralight leading-7 px-3 md:px-3 lg:px-0">
            {blog?.blogDescription}
          </p>
        </div>
        <div className="max-w-7xl">
          <Image
            src={`${baseUrl}${blog?.blogCoverImage?.url}`}
            alt={blog?.blogTitle}
            width={800}
            height={500}
            className="w-full md:w-[70vw] h-[15rem] md:h-[30rem] lg:h-[35rem] shadow-lg mb-8 rounded-none md:rounded-3xl"
          />
        </div>
        <div className="max-w-4xl px-3 md:px-0">
          <div className="text-left flex flex-col gap-2">
            {blog?.blogContent?.map((block: any, index: number) => {
              if (block.type === "list") {
                return (
                  <ul
                    key={index}
                    className={`text-lg font-light text-black ${
                      block.format === "ordered" ? "list-decimal" : "list-disc"
                    } pl-6`}
                  >
                    {block.children.map(
                      (listItem: any, listItemIndex: number) => (
                        <li key={listItemIndex}>
                          {listItem.children.map(
                            (child: any, childIndex: number) => (
                              <span
                                key={childIndex}
                                className={`${
                                  child?.bold === true ? "font-semibold" : ""
                                }`}
                              >
                                {child.text}
                              </span>
                            )
                          )}
                        </li>
                      )
                    )}
                  </ul>
                );
              } else {
                return (
                  <p key={index} className="text-lg font-light text-black">
                    {block.children.map((child: any, childIndex: number) => (
                      <span
                        key={childIndex}
                        className={`${
                          child?.bold === true ? "font-semibold" : ""
                        }`}
                      >
                        {child.text}
                      </span>
                    ))}
                  </p>
                );
              }
            })}
          </div>
        </div>
      </div>
      {/* Content */}

      <RelatedBlogs />

      <BuyMeACoffee url="../footer-vid.mp4" />
    </div>
  );
}
