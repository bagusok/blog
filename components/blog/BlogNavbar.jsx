import { useSetAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BsJustifyLeft } from 'react-icons/bs';
import { HiOutlineMoon } from 'react-icons/hi';
import { FiSearch } from 'react-icons/fi';
import { isOpenSidebar } from './BlogSidebar';
import { useState } from 'react';

export default function BlogNavbar() {
  const setOpenSidebar = useSetAtom(isOpenSidebar);
  const [openSearchBar, setOpenSearchBar] = useState(false);

  const router = useRouter();

  const handleSearch = async (e) => {
    e.preventDefault();
    router.push(`/search?q=${e.target[0].value}`);
  };

  return (
    <header className="w-full h-14 bg-white shadow-sm flex justify-between items-center gap-2 sticky top-0 z-50 lg:relative lg:pl-4">
      <div className="blog-title inline-flex items-center gap-2 lg:w-64 pl-5 lg:pl-4">
        <BsJustifyLeft className="lg:hidden w-6 h-6" onClick={() => setOpenSidebar((prev) => !prev)} />
        <Link href="/" className="text-xl lg:text-2xl font-bold">
          SanBlog
        </Link>
      </div>
      <div className="px-3 md:px-0 w-full md:w-8/12">
        <div
          className={`${
            openSearchBar ? '' : 'hidden'
          } md:block md:static absolute top-14 right-0 left-0 bg-white border md:border-none py-4 px-2 shadow-lg md:shadow-none rounded md:rounded-none`}
        >
          <form onSubmit={(e) => handleSearch(e)}>
            <input
              type="text"
              className="h-10 md:h-8 w-3/4 rounded border border-gray-200 focus:outline focus:outline-gray-300 text-sm font-regular py-2 px-5"
              placeholder="Search Here..."
            />
            <button
              type="submit"
              className="bg-blue-500 rounded text-sm text-white py-[0.65rem] md:py-[0.35rem] px-4 ml-3"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="group lg:w-3/12 inline-flex justify-end items-center gap-2 pr-5 lg:pr-6">
        <FiSearch
          onClick={() => setOpenSearchBar((prev) => !prev)}
          className="w-[1.85rem] h-[1.85rem] md:hidden font-regular cursor-pointer hover:opacity-70"
        />
        <HiOutlineMoon className="w-[1.85rem] h-[1.85rem] font-regular cursor-pointer hover:opacity-70" />
        {/* <div className="rounded-full w-9 h-9">
          <Image src="/images/avatar.png" alt="profile" width={40} height={40} className="w-9 h-9" />
        </div> */}
      </div>
    </header>
  );
}
