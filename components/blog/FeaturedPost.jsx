import Image from 'next/image';
import { fetcher } from '../../lib/fetcher';
import useSWR from 'swr';
import ImageFallback from '../ImageFallback';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function FeaturedPost() {
  const { data, error, isLoading } = useSWR('/api/v1/post/featured-post', fetcher);
  const router = useRouter();

  const navigate = (path) => {
    router.push(path);
  };

  return (
    <>
      <div className="w-full mt-3 flex flex-col gap-3 md:sticky md:top-16 lg:top-3">
        <h2 className="text-md font-semibold text-black">Latest Post</h2>
        {isLoading && <FeaturedPostSkeleton />}
        {error && <p>Something went wrong</p>}
        {data &&
          data.data?.map((post, i) => {
            return (
              <div key={i} className="inline-flex">
                <div className="w-1/4">
                  <div className="h-full w-auto lg:w-14 lg:h-14 rounded-md overflow-hidden bg-slate-200">
                    <ImageFallback
                      onClick={() => navigate(`/${post.slug}`)}
                      src={post.thumbnail}
                      alt="Image"
                      width={500}
                      height={500}
                      className="object-cover h-full w-auto"
                    />
                  </div>
                </div>
                <div className="w-3/4 flex flex-col ml-3">
                  <Link
                    href={`/${post.slug}`}
                    className="text-base font-semibold text-black h-16 text-ellipsis max-w-full overflow-hidden hover:underline"
                  >
                    {post.title}
                  </Link>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

export const FeaturedPostSkeleton = () => {
  return (
    <div className="inline-flex gap-2">
      <div className="w-16 h-16 md:w-18 md:h-14 lg:w-14 lg:h-14 rounded-md overflow-hidden bg-slate-200 animate-pulse"></div>

      <div className="w-3/4 flex flex-col ml-3">
        <div className="bg-slate-200 rounded w-full h-6 animate-pulse"></div>
      </div>
    </div>
  );
};
