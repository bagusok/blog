import { useSetAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import { BsJustifyLeft } from 'react-icons/bs';
import { HiOutlineMoon } from 'react-icons/hi';
import { isOpenSidebar } from './BlogSidebar';

export default function BlogNavbar() {
  const setOpenSidebar = useSetAtom(isOpenSidebar);

  return (
    <header className="w-full h-14 bg-white shadow-sm flex justify-between items-center gap-2 sticky top-0 z-50 lg:relative lg:pl-4">
      <div className="blog-title inline-flex items-center gap-2 lg:w-64 pl-5 lg:pl-4">
        <BsJustifyLeft className="lg:hidden w-6 h-6" onClick={() => setOpenSidebar((prev) => !prev)} />
        <Link href="/" className="text-xl lg:text-2xl font-bold">
          SanBlog
        </Link>
      </div>
      <div className="hidden lg:block lg:w-8/12 relative">
        <input
          type="text"
          className="h-8 w-2/3 rounded-full border border-gray-200 focus:outline focus:outline-gray-300 text-sm font-regular py-2 px-5"
          placeholder="Search Here..."
        />
      </div>
      <div className="group lg:w-3/12 inline-flex justify-end items-center gap-2 pr-5 lg:pr-6">
        <HiOutlineMoon className="w-8 h-8 font-regular " />
        <div className="rounded-full w-9 h-9">
          <Image src="/images/avatar.png" alt="profile" width={40} height={40} className="w-9 h-9" />
        </div>
      </div>
    </header>
  );
}
