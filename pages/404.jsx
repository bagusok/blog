import BlogSidebar from '../components/blog/BlogSidebar';
import BlogNavbar from '../components/blog/BlogNavbar';
import BlogFooter from '../components/blog/BlogFooter';
import Head from 'next/head';
import useSwr from 'swr';
import { fetcher } from '../lib/fetcher';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Image from 'next/image';

const AsideDynamic = dynamic(() => import('../components/blog/Aside'), { ssr: false });

export default function Custom404() {
  const { data: listMenu, error: errorMenu, isLoading: isLoadingMenu } = useSwr(`/api/v1/list-menu`, fetcher);

  console.log(listMenu?.data);

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
          {!isLoadingMenu && !errorMenu && <BlogSidebar sidebar={listMenu?.data} />}
          <article className="lg:w-7/12 md:w-8/12 mt-5 px-4 lg:px-2 relative flex justify-center">
            <div className="h-80 w-80 overflow-hidden mt-10">
              <Image
                src="/images/notfound.png"
                alt="404"
                width={1000}
                height={1000}
                className="h-full w-auto object-cover"
              />
            </div>
          </article>
          <AsideDynamic />
        </main>
        <BlogFooter />
      </div>
    </>
  );
}
