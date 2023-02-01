import Image from 'next/image';
import BlogSidebar from '../components/blog/BlogSidebar';
import BlogNavbar from '../components/blog/BlogNavbar';
import Link from 'next/link';
import BlogFooter from '../components/blog/BlogFooter';
import Head from 'next/head';
import { prismaOrm } from '../lib/prisma';
import ImageFallback from '../components/ImageFallback';
import useSwr from 'swr';
import { fetcher } from '../lib/fetcher';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const AsideDynamic = dynamic(() => import('../components/blog/Aside'), { ssr: false });

export default function Home({ menuItem, page }) {
  const { data: listPost, error, isLoading } = useSwr(`/api/v1/post?page=${page}`, fetcher);
  const { data: listTags, error: errorTags, isLoading: isLoadingTags } = useSwr(`/api/v1/post/get-tags`, fetcher);

  const router = useRouter();

  const navigate = (page = 1) => {
    return router.push({
      pathname: '/',
      query: {
        page,
      },
    });
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />

        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />

        {/* <link rel="preload" href="/images/no-image.png" as="image" /> */}

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
        <meta property="twitter:title" content="Bagusok" />
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
            {(page == 1 || (!page && !isLoading)) && (
              <section className="featured flex flex-col lg:flex-row gap-4 lg:px-0">
                <div className="lg:w-1/2 rounded-md overflow-hidden h-full w-auto">
                  <ImageFallback
                    src={listPost?.data[0]?.thumbnail || '/images/no-image.png'}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="LEHC4WWB2yk8pyoJadR*.7kCMdnj"
                    alt="Image"
                    width={500}
                    height={500}
                    className="object-cover w-full"
                  />
                </div>
                <div className="lg:w-1/2 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/${listPost?.data[0]?.slug}`}
                      className="font-semibold text-black text-xl lg:text-lg hover:border-b-2 hover:border-slate-500 hover:opacity-70"
                    >
                      {listPost?.data[0]?.title}
                    </Link>
                    <p className="hidden md:block font-regular text-sm text-slate-400 mt-2">
                      {listPost?.data[0]?.body}
                    </p>
                  </div>
                  <p className="block font-regular text-sm text-slate-500 mt-2">
                    {new Date(listPost?.data[0]?.publishedAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </p>
                </div>
              </section>
            )}
            <section id="latest-post-list">
              {isLoading && <PostListSkeleton count={5} />}
              {!error && !isLoading && (
                <div className="latest-post flex flex-col md:flex-row flex-wrap lg:flex-row lg:flex-wrap gap-8 md:gap-0 lg:gap-0 mt-8 lg:mt-10">
                  {listPost.data.map((a, i) => {
                    if (i == 0 && page == 1) {
                      return null;
                    }
                    return <ListPostSection key={i} data={a} />;
                  })}
                </div>
              )}
            </section>
            {/* Pagination */}
            <div className="flex justify-center mt-16">
              <nav aria-label="Page navigation">
                <ul className="inline-flex">
                  {listPost?.prev && (
                    <>
                      <li>
                        <button
                          onClick={() => navigate(listPost?.prev)}
                          className="h-10 px-5 text-blue-500 transition-colors duration-150 rounded-l-lg focus:shadow-outline hover:bg-indigo-100"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => navigate(listPost?.prev)}
                          className="h-10 px-5 text-blue-500 transition-colors duration-150 focus:shadow-outline hover:bg-indigo-100"
                        >
                          {listPost?.prev}
                        </button>
                      </li>
                    </>
                  )}
                  <li>
                    <button className="h-10 px-5 text-white transition-colors duration-150 bg-blue-500 rounded border border-r-0 focus:shadow-outline">
                      {listPost?.page}
                    </button>
                  </li>
                  {listPost?.next !== null && (
                    <>
                      <li>
                        <button
                          onClick={() => navigate(listPost?.next)}
                          className="h-10 px-5 text-blue-500 transition-colors duration-150 focus:shadow-outline hover:bg-indigo-100"
                        >
                          {listPost?.next}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => navigate(listPost?.next)}
                          className="h-10 px-5 text-blue-500 transition-colors duration-150 bg-white rounded-r-lg focus:shadow-outline hover:bg-indigo-100"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </div>
            <div className="w-full mt-10 h-14 border border-dashed border-slate-500 flex justify-center items-center">
              <p className="text-sm text-slate-500">ADS BANNER</p>
            </div>
            <div className="flex flex-row flex-wrap gap-2 mt-8">
              {!isLoadingTags &&
                !errorTags &&
                listTags?.data?.map((a, i) => {
                  return (
                    <button
                      key={i}
                      className="bg-white border border-slate-300 py-1 px-3 text-sm font-light text-slate-500 rounded-sm hover:border-slate-300 hover:bg-slate-300 hover:text-white"
                    >
                      {a.name}
                    </button>
                  );
                })}
            </div>
          </article>
          <AsideDynamic />
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

export async function getServerSideProps(ctx) {
  // const getItem = await fetch(`${process.env.BASE_URL}/api/v1/list-menu`).then((res) => res.json());
  const page = ctx.query?.page || 1;
  const getMenu = await prismaOrm.navbar.findMany({
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

  if (!getMenu) return { notFound: true };

  return {
    props: {
      menuItem: getMenu || null,
      page: page || null,
    },
  };
}

export const ListPostSection = ({ data }) => {
  console.log('aa', data);
  return (
    <div className="lg:w-1/3 md:w-1/2 flex flex-col justify-between rounded-md overflow-hidden md:p-2 lg:p-2 ">
      <div>
        <div className="image rounded-md overflow-hidden md:h-32 w-auto bg-slate-100/50 relative">
          <ImageFallback
            src={data.thumbnail}
            loading="lazy"
            placeholder="blur"
            blurDataURL="LEHC4WWB2yk8pyoJadR*.7kCMdnj"
            alt="Image"
            width={500}
            height={500}
            className="md:h-full w-full object-cover"
          />
        </div>
        <div className="text-body mt-1">
          <p className="font-semibold text-base text-melrose-400">{data.categories}</p>
          <Link
            href={`/${data.slug}`}
            className="font-semibold text-black text-xl lg:text-lg hover:border-b-2 hover:border-slate-500 hover:opacity-70"
          >
            {data.title}
          </Link>
        </div>
      </div>
      <p className="font-regular text-sm text-slate-500 mt-2">
        {new Date(data.publishedAt).toLocaleString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })}
      </p>
    </div>
  );
};
