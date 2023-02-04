import SideBar from '../../../components/user/Sidebar';
import Image from 'next/image';
import useSWR, { useSWRConfig, mutate } from 'swr';
import { fetchWithToken } from '../../../lib/fetcher';
import { BsTrash, BsFillPencilFill, BsShare } from 'react-icons/bs';
import { HiGlobe } from 'react-icons/hi';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { toast, ToastBar, Toaster } from 'react-hot-toast';
import moment from 'moment/moment';
import { useState } from 'react';
import { parseCookies } from 'nookies';

export default function Pages({ token }) {
  const router = useRouter();
  const [createButtonIsLoading, setCreateButtonIsLoading] = useState(false);

  const { data, error, isLoading } = useSWR(['/api/v1/user/pages', token], fetchWithToken);

  const handleCreatePage = async () => {
    setCreateButtonIsLoading(true);
    const createPage = await fetch('/api/v1/user/pages/create', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    try {
      const res = await createPage.json();
      if (res.status) {
        console.log(res);
        router.push(`/user/pages/edit/${res.data.id}`, undefined, {
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

  const handleDeletePage = async (id) => {
    const deletePage = await fetch('/api/v1/user/pages/delete', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ pageId: id }),
    });
    try {
      const res = await deletePage.json();
      if (res.status) {
        toast.success(res.message);
        mutate(['/api/v1/user/pages', token]);
        // router.reload();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePublishPage = async (id, isPublished) => {
    const setPubllic = await fetch('/api/v1/user/pages/set-public', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId: id, isPublished: !isPublished }),
    });

    try {
      const res = await setPubllic.json();

      if (res.status) {
        toast.success(res.message);
        mutate(['/api/v1/user/pages', token]);
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
          onClick={() => handleCreatePage()}
        >
          {createButtonIsLoading ? 'Loading...' : 'Create Page'}
        </button>
      </div>
      <div className="list-post flex flex-col justify-between gap-2 md:px-40 p-2">
        {isLoading && <ListPostSkeleton />}
        {data?.data?.length === 0 && <p className="text-center">No Pages</p>}
        {error && <p>Error...</p>}
        {data &&
          data?.data?.map((pages, i) => {
            return (
              <div
                key={i}
                className="post-card flex flex-row justify-between border border-slate-500 rounded-md py-2 pl-3 pr-5 w-full overflow-hidden"
              >
                <div className="flex flex-col">
                  <h2 className="text-md font-semibold text-black truncate md:w-96 w-40">{pages.title}</h2>
                  <div className="md:inline-flex gap-2">
                    <p className="md:text-sm text-xs text-gray-500 max-w-5/6">
                      {pages.isPublished
                        ? ` Published on ${moment(pages.publishedAt).format('MMMM Do YYYY, hh:mm')}`
                        : 'Not Published'}
                    </p>
                  </div>
                </div>

                <div className="inline-flex flex-wrap self-center gap-3">
                  <BsFillPencilFill
                    onClick={() => router.push(`/user/pages/edit/${pages.id}`)}
                    className="text-lg text-gray-500 hover:text-blue-500"
                  />
                  <BsTrash
                    onClick={() => handleDeletePage(pages.id)}
                    className="text-lg text-gray-500 hover:text-red-500"
                  />
                  <BsShare className="text-lg text-gray-500 hover:text-green-500" />

                  <HiGlobe
                    onClick={() => handlePublishPage(pages.id, pages.isPublished)}
                    className={`text-lg hover:opacity-70 ${pages.isPublished ? 'text-green-500' : 'text-gray-500'}`}
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

export function getServerSideProps(ctx) {
  const cookie = parseCookies(ctx);
  const token = cookie.token;

  if (!token) {
    return {
      redirect: {
        destination: '/user/auth/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      token,
    },
  };
}
