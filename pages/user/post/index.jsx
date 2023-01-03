import SideBar from '../../../components/user/Sidebar';
import Image from 'next/image';
import useSWR, { useSWRConfig, mutate } from 'swr';
import { fetchWithToken } from '../../../lib/fetcher';

import { BsTrash, BsFillPencilFill, BsShare } from 'react-icons/bs';
import { HiGlobe } from 'react-icons/hi';
import { useAtomValue } from 'jotai';
import { jwtToken } from '../../../store/cookies';
import { useRouter } from 'next/router';
import { toast, ToastBar, Toaster } from 'react-hot-toast';
import moment from 'moment/moment';
import handleNotAuthentication from '../../../lib/logout';
import { useState } from 'react';

export default function Post() {
  const getJwtToken = useAtomValue(jwtToken);
  const router = useRouter();
  const [createButtonIsLoading, setCreateButtonIsLoading] = useState(false);

  const { data, error, isLoading } = useSWR(['/api/v1/user/post', getJwtToken], fetchWithToken);

  if (error?.status == 401) {
    handleNotAuthentication(router);
  }

  const handleCreatePost = async () => {
    setCreateButtonIsLoading(true);
    const createPost = await fetch('/api/v1/user/post/create-post', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${getJwtToken}`,
      },
    });
    try {
      const res = await createPost.json();
      if (res.status) {
        console.log(res);
        router.push(`/user/post/edit/${res.data.id}`, undefined, {
          shallow: true,
        });
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.log(err);
    }
    setCreateButtonIsLoading(false);
  };

  const handleDeletePost = async (id) => {
    const deletePost = await fetch('/api/v1/user/post/delete-post', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${getJwtToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ postId: id }),
    });
    try {
      const res = await deletePost.json();
      if (res.status) {
        toast.success(res.message);
        mutate(['/api/v1/user/post', getJwtToken]);
        // router.reload();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePublishPost = async (id, isPublished) => {
    const setPubllic = await fetch('/api/v1/user/post/set-public', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${getJwtToken}`,
      },
      body: JSON.stringify({ postId: id, isPublished: !isPublished }),
    });

    try {
      const res = await setPubllic.json();

      if (res.status) {
        toast.success(res.message);
        mutate(['/api/v1/user/post', getJwtToken]);
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <Toaster />
      <SideBar />
      <div className="md:px-40 p-2 w-full flex justify-end">
        <button
          className="bg-orange-500 text-white font-semibold text-sm rounded-sm px-5 py-3 hover:opacity-80 disabled:opacity-60"
          disabled={createButtonIsLoading}
          onClick={() => handleCreatePost()}
        >
          {createButtonIsLoading ? 'Loading...' : 'Create Post'}
        </button>
      </div>
      <div className="list-post flex flex-col justify-between gap-2 md:px-40 p-2">
        {isLoading && <ListPostSkeleton />}
        {data?.data?.length === 0 && <p className="text-center">No Post</p>}
        {error && <p>Error...</p>}
        {data &&
          data?.data?.map((post, i) => {
            return (
              <div
                key={i}
                className="post-card flex flex-row justify-between border border-slate-500 rounded-md py-2 pl-3 pr-5 w-full overflow-hidden"
              >
                <div className="inline-flex gap-2 w-2/3">
                  <Image
                    alt="My First Blog Post"
                    src="https://bagusoks.nyc3.digitaloceanspaces.com/blog/wVjBNogjCKTX0j_FN_tANX9Jnbq0xO.webp"
                    width={75}
                    height={75}
                    className="rounded-md object-cover h-auto w-[75px]"
                    priority
                  />
                  <div className="flex flex-col">
                    <h2 className="text-md font-semibold text-black truncate md:w-96 w-40">{post.title}</h2>
                    <div className="md:inline-flex gap-2">
                      <p className="md:text-sm text-xs text-gray-500 max-w-5/6">
                        {post.isPublished
                          ? ` Published on ${moment(post.publishedAt).format('MMMM Do YYYY, hh:mm')}`
                          : 'Not Published'}
                      </p>
                      <span className="bg-blue-100 text-blue-800 md:text-sm text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                        {post.categories}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="inline-flex flex-wrap self-center gap-3">
                  <BsFillPencilFill
                    onClick={() =>
                      router.push(`/user/post/edit/${post.id}`, undefined, {
                        shallow: true,
                      })
                    }
                    className="text-lg text-gray-500 hover:text-blue-500"
                  />
                  <BsTrash
                    onClick={() => handleDeletePost(post.id)}
                    className="text-lg text-gray-500 hover:text-red-500"
                  />
                  <BsShare className="text-lg text-gray-500 hover:text-green-500" />

                  <HiGlobe
                    onClick={() => handlePublishPost(post.id, post.isPublished)}
                    className={`text-lg hover:opacity-70 ${post.isPublished ? 'text-green-500' : 'text-gray-500'}`}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

export function ListPostSkeleton() {
  let i = [1, 2, 3, 4, 5];
  return (
    <>
      {i.map((a, i) => {
        return (
          <div
            key={i}
            role="status"
            className="flex flex-row justify-between items-center animate-pulse border border-slate-500/30 rounded-md py-2 pl-3 pr-5 w-full overflow-hidden"
          >
            <div className="inline-flex gap-2 w-2/3">
              <div className="h-16 w-16 bg-slate-300/50 rounded-md"></div>
              <div className="flex flex-col gap-2">
                <div className="md:w-96 w-40 h-3 bg-slate-300/50 rounded-full"></div>
                <div className="md:w-80 w-32 h-3 bg-slate-300/50 rounded-full"></div>
                <div className="md:w-32 w-24 h-3 bg-slate-300/50 rounded-full"></div>
              </div>
            </div>
            <div className="self-center inline-flex gap-3 h-fit">
              <div className="rounded-full w-8 h-8 bg-slate-300/50"></div>
              <div className="rounded-full w-8 h-8 bg-slate-300/50"></div>
              <div className="rounded-full w-8 h-8 bg-slate-300/50"></div>
              <div className="rounded-full w-8 h-8 bg-slate-300/50"></div>
            </div>
          </div>
        );
      })}
    </>
  );
}
