import { PrismaClient } from '@prisma/client';
import { atom, useAtom, useAtomValue } from 'jotai';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaFacebook, FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';
import { HiOutlineFolder, HiOutlineHome } from 'react-icons/hi';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import * as HeroIcon from '@heroicons/react/24/outline';

export const isOpenSidebar = atom(false);

export default function BlogSidebar() {
  const isOpen = useAtomValue(isOpenSidebar);

  const [menuItem, setMenuItem] = useState([]);

  const getMenu = async () => {
    const data = await fetch('http://localhost:3000/api/v1/list-menu');

    return await data.json();
  };

  useEffect(() => {
    const getMenuData = getMenu().then((res) => setMenuItem(res.data));
  }, []);

  const Icon = ({ name, ...rest }) => {
    const IconComponent = HeroIcon[name];
    return IconComponent ? <IconComponent {...rest} /> : null;
  };

  return (
    <nav
      className={`${
        isOpen ? '-translate-x-0' : '-translate-x-[50rem]'
      } lg:-translate-x-0 ease-in-out duration-300 w-64 min-h-screen flex flex-col self-start px-2 bg-white shadow-md lg:shadow-none border-r border-melrose-100 fixed lg:sticky z-50 top-14 lg:top-0 left-0`}
    >
      <ul className="w-full mt-3">
        {menuItem?.map((a, i) => {
          return (
            <li
              key={i}
              className="w-full inline-flex items-center gap-3 rounded-sm text-base font-medium text-gray-500 py-2 px-5 hover:bg-melrose-100 "
            >
              <Icon name={a.icon} className="w-5 h-5 text-melrose-300" />

              <Link href="/">{a.name}</Link>
            </li>
          );
        })}
      </ul>
      {/* <div className="h-[1px] my-6 bg-melrose-200"></div> */}
      {/* <ul className="w-full mt-3">
        <li className="w-full inline-flex items-center gap-3 rounded-sm text-md font-regular text-gray-500 py-2 px-5 hover:bg-melrose-100">
          <Link href="/">About</Link>
        </li>
        <li className="w-full inline-flex items-center gap-3 rounded-sm text-md font-regular text-gray-500 py-2 px-5 hover:bg-melrose-100">
          <Link href="/">Contact</Link>
        </li>
        <li className="w-full inline-flex items-center gap-3 rounded-sm text-md font-regular text-gray-500 py-2 px-5 hover:bg-melrose-100">
          <Link href="/">Disclaimer</Link>
        </li>
        <li className="w-full inline-flex items-center gap-3 rounded-sm text-md font-regular text-gray-500 py-2 px-5 hover:bg-melrose-100">
          <Link href="/">Privacy</Link>
        </li>
      </ul> */}

      <div className="w-full px-2 mt-auto mb-16">
        <div className="w-full border-2 border-dashed rounded-md flex justify-center items-center h-32">
          <h2>Ads</h2>
        </div>
      </div>

      <div className="absolute bottom-5 left-0 inline-flex gap-4 pl-5">
        <Link href="/">
          <FaFacebook className="w-[1.4rem] h-[1.4rem]" />
        </Link>
        <Link href="/">
          <FaTwitter className="w-[1.4rem] h-[1.4rem]" />
        </Link>
        <Link href="/">
          <FaGithub className="w-[1.4rem] h-[1.4rem]" />
        </Link>
        <Link href="/">
          <FaInstagram className="w-[1.4rem] h-[1.4rem]" />
        </Link>
      </div>
    </nav>
  );
}
