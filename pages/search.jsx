import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { ListPostSection, PostListSkeleton } from '.';
import BlogFooter from '../components/blog/BlogFooter';
import BlogNavbar from '../components/blog/BlogNavbar';
import BlogSidebar from '../components/blog/BlogSidebar';
import ImageFallback from '../components/ImageFallback';
import { fetcher } from '../lib/fetcher';
import { prismaOrm } from '../lib/prisma';
import useSwr from 'swr';
import { useRouter } from 'next/router';
import { redirect } from 'next/dist/server/api-utils';

const AsideDynamic = dynamic(() => import('../components/blog/Aside'), { ssr: false });

export default function Search({ search, menuItem }) {
  //   const { data: listPost, error, isLoading } = useSwr(`/api/v1/post?page=${page}`, fetcher);
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
            <section id="latest-post-list">
              <div className="latest-post flex flex-col md:flex-row flex-wrap lg:flex-row lg:flex-wrap gap-8 md:gap-0 lg:gap-0 mt-8 lg:mt-10">
                {search?.map((a, i) => {
                  return <ListPostSection key={i} data={a} />;
                })}
              </div>
            </section>
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

export async function getServerSideProps(ctx) {
  const { q } = ctx.query;

  const newQ = decodeURI(q).replaceAll(' ', '|');

  const search = await prismaOrm.Post.findMany({
    where: {
      title: {
        search: newQ,
      },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      thumbnail: true,
    },
  });

  if (!search || search.length === 0)
    return {
      notFound: true,
    };

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
      search,
      menuItem: getMenu || null,
    },
  };
}
