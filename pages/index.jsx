import Image from 'next/image';
import Aside from '../components/blog/Aside';
import BlogSidebar from '../components/blog/BlogSidebar';
import BlogNavbar from '../components/blog/BlogNavbar';
import { fetcher } from '../lib/fetcher';
import useSWR from 'swr';
import Link from 'next/link';
import BlogFooter from '../components/blog/BlogFooter';

export default function Home() {
  const { data, error, isLoading } = useSWR('/api/v1/post', fetcher);

  console.log(data, error, isLoading);

  return (
    <>
      <div className="flex flex-col relative">
        <BlogNavbar />
        <main className="w-full min-h-screen flex flex-col md:flex-row lg:flex-row lg:gap-2">
          <BlogSidebar />
          <article className="lg:w-7/12 md:w-8/12 mt-5 px-4 lg:px-2 relative">
            <section className="featured flex flex-col lg:flex-row gap-4 lg:px-0">
              <div className="lg:w-1/2 rounded-md overflow-hidden h-full w-auto">
                <Image
                  src="https://bagusoks.nyc3.digitaloceanspaces.com/blog/BLyk7c-aLxNmOyPctleg_lf24SYLyA.webp"
                  alt="Image"
                  width={500}
                  height={500}
                  className="object-cover w-full"
                />
              </div>
              <div className="lg:w-1/2">
                <Link
                  href={`/${data?.data[0]?.slug}`}
                  className="font-semibold text-black text-xl lg:text-lg hover:border-b-2 hover:border-slate-500 hover:opacity-70"
                >
                  {data?.data[0]?.title}
                </Link>
                <p className="hidden md:block font-regular text-sm text-slate-400 mt-2">{data?.data[0]?.body}</p>
                <p className="block lg:hidden font-regular text-sm text-slate-500 mt-2">1 Januari 2023, 16:43</p>
              </div>
            </section>
            <section id="latest-post-list">
              {isLoading && <PostListSkeleton count={6} />}
              <div className="latest-post flex flex-col md:flex-row flex-wrap lg:flex-row lg:flex-wrap gap-8 md:gap-0 lg:gap-0 mt-8 lg:mt-10">
                {data?.data?.map((a, i) => {
                  if (i !== 0)
                    return (
                      <div
                        key={i}
                        className="lg:w-1/3 md:w-1/2 flex flex-col justify-between rounded-md overflow-hidden md:p-2 lg:p-2 "
                      >
                        <div>
                          <div className="image rounded-md overflow-hidden md:h-32 w-auto bg-blue-500 relative">
                            <Image
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
