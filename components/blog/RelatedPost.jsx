import { fetcher } from '../../lib/fetcher';
import ImageFallback from '../ImageFallback';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function RelatedPost({ tags, postId }) {
  const newTags = tags
    .map((tag) => tag.tagName)
    .toString()
    .replaceAll(' ', ',');

  const { data, error, isLoading } = useSWR('/api/v1/post/related-post?tags=' + newTags + '&id=' + postId, fetcher);

  const router = useRouter();

  const navigate = (path) => {
    router.push(path);
  };

  return (
    <>
      <div>
        <h3 className="text-lg font-regular text-black mt-8">Postingan yang mungkin anda suka</h3>
        {isLoading && <p>Loading...</p>}
        {error && <p>Failed to load</p>}
        <div className="w-full overflow-x-auto mt-2">
          <div className="inline-flex gap-3 w-auto">
            {!isLoading &&
              !error &&
              data.data?.map((post, i) => {
                return (
                  <div key={i} className="flex flex-col h-60 w-80" style={{ width: '12rem' }}>
                    <div className="h-32">
                      <ImageFallback
                        onClick={() => navigate(`/${post.slug}`)}
                        alt="thumbnail"
                        src={post.thumbnail}
                        width={500}
                        height={500}
                        className="object-cover w-auto h-full rounded-md"
                      />
                    </div>
                    <div className="mt-2">
                      <Link href={`/${post.slug}`} className="text-base font-semibold text-black hover:underline">
                        {post.title}
                      </Link>
                      <p className="text-sm font-regular text-slate-500">
                        {new Date(post?.publishedAt).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
