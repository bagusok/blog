import Image from 'next/image';
import Aside from '../components/blog/Aside';
import BlogSidebar from '../components/blog/BlogSidebar';
import BlogNavbar from '../components/blog/BlogNavbar';
import Link from 'next/link';
import BlogFooter from '../components/blog/BlogFooter';
import Head from 'next/head';
import { prismaOrm } from '../lib/prisma';
import ImageFallback from '../components/ImageFallback';

export default function Home({ menuItem, listPost }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        <title>Bagusok Blog</title>
        <meta name="robots" content="all" />

        <meta name="author" content="Rizqi Bagus Andrean" />
        <meta
          name="keywords"
          content="Bagus, Bagusok, Rizqi Bagus Andrean, tutorial, bagusok blog, Rizqi Bagus Andrean Blog, Bagus Blog, blog, blog pemrograman, jaringan, linux, mobile legend, free fire, aplikasi"
        />

        <meta name="title" content="Bagusok Blog" />
        <meta
          name="description"
          content="Blog untuk sharing seputar teknologi yang berkembang di masyarakat bumi, maupun planet lain."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bagusok.com/" />
        <meta property="og:title" content="Bagusok Blog" />
        <meta
          property="og:description"
          content="Blog untuk sharing seputar teknologi yang berkembang di masyarakat bumi, maupun planet lain."
        />
        <meta property="og:image" content="https://i.postimg.cc/Pr7KbPz9/Frame-1.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://bagusok.com/" />
        <meta property="twitter:title" content="Bagusok Blog" />
        <meta
          property="twitter:description"
          content="Blog untuk sharing seputar teknologi yang berkembang di masyarakat bumi, maupun planet lain."
        />
        <meta property="twitter:image" content="https://i.postimg.cc/Pr7KbPz9/Frame-1.png" />
      </Head>

      <div className="flex flex-col relative">
        <BlogNavbar />
        <main className="w-full min-h-screen flex flex-col md:flex-row lg:flex-row lg:gap-2">
          <BlogSidebar menuItem={menuItem} />
          <article className="lg:w-7/12 md:w-8/12 mt-5 px-4 lg:px-2 relative">
            <section className="featured flex flex-col lg:flex-row gap-4 lg:px-0">
              <div className="lg:w-1/2 rounded-md overflow-hidden h-full w-auto">
                <ImageFallback
                  src={listPost[0]?.thumbnail}
                  alt="Image"
                  width={500}
                  height={500}
                  className="object-cover w-full"
                />
              </div>
              <div className="lg:w-1/2">
                <Link
                  href={`/${listPost[0]?.slug}`}
                  className="font-semibold text-black text-xl lg:text-lg hover:border-b-2 hover:border-slate-500 hover:opacity-70"
                >
                  {listPost[0]?.title}
                </Link>
                <p className="hidden md:block font-regular text-sm text-slate-400 mt-2">{listPost[0]?.body}</p>
                <p className="block lg:hidden font-regular text-sm text-slate-500 mt-2">1 Januari 2023, 16:43</p>
              </div>
            </section>
            <section id="latest-post-list">
              <div className="latest-post flex flex-col md:flex-row flex-wrap lg:flex-row lg:flex-wrap gap-8 md:gap-0 lg:gap-0 mt-8 lg:mt-10">
                {listPost?.map((a, i) => {
                  if (i !== 0)
                    return (
                      <div
                        key={i}
                        className="lg:w-1/3 md:w-1/2 flex flex-col justify-between rounded-md overflow-hidden md:p-2 lg:p-2 "
                      >
                        <div>
                          <div className="image rounded-md overflow-hidden md:h-32 w-auto bg-blue-500 relative">
                            <ImageFallback
                              src={a.thumbnail}
                              alt="Image"
                              width={500}
                              height={500}
                              className="md:h-full w-full object-cover"
                            />
                          </div>
                          <div className="text-body mt-1">
                            <p className="font-semibold text-base text-melrose-400">{a.categories}</p>
                            <Link
                              href={`/${a.slug}`}
                              className="font-semibold text-black text-xl lg:text-lg hover:border-b-2 hover:border-slate-500 hover:opacity-70"
                            >
                              {a.title}
                            </Link>
                          </div>
                        </div>
                        <p className="font-regular text-sm text-slate-500 mt-2">1 Januari 2023, 16:43</p>
                      </div>
                    );
                })}
              </div>
            </section>
            <div className="flex justify-center mt-16">
              <button
                type="button"
                className="rounded-md py-1 px-5 text-md font-medium text-white bg-melrose-300 hover:opacity-70 justify-self-center"
              >
                Next Page
              </button>
            </div>
            <div className="w-full mt-10 h-14 border border-dashed border-slate-500 flex justify-center items-center">
              <p className="text-sm text-slate-500">ADS BANNER</p>
            </div>
            <div className="flex flex-row flex-wrap gap-2 mt-8">
              <button className="bg-white border border-slate-300 py-1 px-3 text-sm font-light text-slate-500 rounded-sm hover:border-melrose-300 hover:bg-melrose-300 hover:text-white">
                React
              </button>
              <button className="bg-white border border-slate-300 py-1 px-3 text-sm font-light text-slate-500 rounded-sm hover:border-melrose-300 hover:bg-melrose-300 hover:text-white">
                Vue
              </button>
              <button className="bg-white border border-slate-300 py-1 px-3 text-sm font-light text-slate-500 rounded-sm hover:border-melrose-300 hover:bg-melrose-300 hover:text-white">
                Laravel
              </button>
              <button className="bg-white border border-slate-300 py-1 px-3 text-sm font-light text-slate-500 rounded-sm hover:border-melrose-300 hover:bg-melrose-300 hover:text-white">
                Next.js
              </button>
              <button className="bg-white border border-slate-300 py-1 px-3 text-sm font-light text-slate-500 rounded-sm hover:border-melrose-300 hover:bg-melrose-300 hover:text-white">
                Buku Terbaru
              </button>
              <button className="bg-white border border-slate-300 py-1 px-3 text-sm font-light text-slate-500 rounded-sm hover:border-melrose-300 hover:bg-melrose-300 hover:text-white">
                TailwindCSS
              </button>
              <button className="bg-white border border-slate-300 py-1 px-3 text-sm font-light text-slate-500 rounded-sm hover:border-melrose-300 hover:bg-melrose-300 hover:text-white">
                Landing Page
              </button>
              <button className="bg-white border border-slate-300 py-1 px-3 text-sm font-light text-slate-500 rounded-sm hover:border-melrose-300 hover:bg-melrose-300 hover:text-white">
                Next.js
              </button>
              <button className="bg-white border border-slate-300 py-1 px-3 text-sm font-light text-slate-500 rounded-sm hover:border-melrose-300 hover:bg-melrose-300 hover:text-white">
                Buku Terbaru
              </button>
              <button className="bg-white border border-slate-300 py-1 px-3 text-sm font-light text-slate-500 rounded-sm hover:border-melrose-300 hover:bg-melrose-300 hover:text-white">
                TailwindCSS
              </button>
              <button className="bg-white border border-slate-300 py-1 px-3 text-sm font-light text-slate-500 rounded-sm hover:border-melrose-300 hover:bg-melrose-300 hover:text-white">
                Landing Page
              </button>
            </div>
          </article>
          <Aside />
        </main>
        <BlogFooter />
      </div>
    </>
  );
}

export function PostListSkeleton({ count = 1 }) {
  let arr = [];

  for (let i = 0; i < count; i++) {
    arr.push(i);
  }

  return (
    <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3 lg:gap-0 mt-3 lg:mt-10">
      {arr?.map((a, i) => {
        return (
          <div key={i} className="lg:w-1/3 flex flex-col justify-between rounded-md overflow-hidden lg:p-2 max-h-72">
            <div>
              <div className="image rounded-md overflow-hidden h-[180px] w-auto bg-slate-300/50 animate-pulse" />
              <div className="text-body mt-1">
                <p className="font-semibold text-base bg-slate-300/50 animate-pulse w-1/3 h-6 rounded-md"></p>
                <h2 className="font-semibold bg-slate-300/50 text-xl lg:text-lg animate-pulse w-full h-6 rounded-md mt-2"></h2>
              </div>
            </div>
            <p className="font-regular text-sm bg-slate-300/50 mt-2 animate-pulse w-2/3 h-6 rounded-md"></p>
          </div>
        );
      })}
    </div>
  );
}

export async function getServerSideProps() {
  // const getItem = await fetch(`${process.env.BASE_URL}/api/v1/list-menu`).then((res) => res.json());

  const getItem = await prismaOrm.navbar.findMany({
    select: {
      id: true,
      name: true,
      icon: true,
      url: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  console.log(getItem);

  if (!getItem) return { notFound: true };

  const getListPost = await fetch(`${process.env.BASE_URL}/api/v1/post`).then((res) => res.json());
  return {
    props: {
      listPost: getListPost.data,
      menuItem: getItem,
    },
  };
}
