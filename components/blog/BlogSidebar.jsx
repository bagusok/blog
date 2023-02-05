import { PrismaClient } from '@prisma/client';
import { atom, useAtom, useAtomValue } from 'jotai';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaFacebook, FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';
import { HiOutlineFolder, HiOutlineHome } from 'react-icons/hi';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import * as HeroIcon from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

export const isOpenSidebar = atom(false);

export default function BlogSidebar({ sidebar }) {
  const isOpen = useAtomValue(isOpenSidebar);

  const router = useRouter();

  const [newSidebar, setNewSidebar] = useState(sidebar);
  useEffect(() => {
    // console.log('sidebar render');
  });

  const handleOpenSidebar = (categoryId, itemId) => {
    // console.log('handleOpenSidebar', categoryId, itemId);
    const list = newSidebar.map((a, i) => {
      const newMenu = a.child.map((b, j) => {
        // const searchIsOpen =
        if (categoryId === i && itemId === j) {
          return {
            ...b,
            isOpen: !b.isOpen,
          };
        }
        return {
          ...b,
          isOpen: false,
        };
      });
      return {
        ...a,
        child: newMenu,
      };
    });
    setNewSidebar(list);
    console.log(newSidebar[0].child[itemId].isOpen);
  };

  const Icon = ({ name, ...rest }) => {
    const IconComponent = HeroIcon[name];
    return IconComponent ? <IconComponent {...rest} /> : null;
  };

  return (
    <nav
      className={`${
        isOpen ? 'w-[18rem]' : 'w-0 -translate-x-20 lg:-translate-x-0 md:w-[5rem]'
      } duration-500 ease-in-out min-h-screen flex flex-col self-start px-2 bg-white shadow-md lg:shadow-none border-r border-melrose-100 fixed lg:sticky z-50 top-14 lg:top-0 left-0`}
    >
      <ul className="flex flex-col gap-8 mt-5 box-border">
        {newSidebar?.map((a, b) => {
          return (
            <li className="" key={b}>
              <span className={`pl-4 md:pl-7 text-sm text-slate-400 scale-0 duration-200 ease-in-out`}>
                {isOpen && a.name}
              </span>
              <ul className="font-light text-gray-600 text-lg md:text-base box-border ">
                {a?.child?.map((c, d) => {
                  return (
                    <li
                      key={d}
                      onClick={() => (c.child.length > 0 ? handleOpenSidebar(b, d) : router.push(c.url))}
                      className="cursor-pointer relative"
                    >
                      <div className="pl-4 pr-3 md:pl-7 inline-flex justify-between items-center w-full rounded h-10 hover:bg-slate-100">
                        <div className={`inline-flex w-[12rem] gap-3 ${!isOpen && 'hidden md:block'}`}>
                          <Icon name={c.icon} className="w-5 h-5" />
                          <span className="hover:text-melrose-400 duration-100 ease-in-out">{isOpen && c.name}</span>
                        </div>
                        {c.child.length > 0 && isOpen && (
                          <span>
                            <HeroIcon.ChevronDownIcon
                              className={`w-5 h-5 ${
                                c.isOpen ? 'rotate-180' : 'rotate-0'
                              } transition-all duration-100 cursor-pointer`}
                            />
                          </span>
                        )}
                      </div>
                      <ul
                        className={` ${
                          !isOpen
                            ? 'md:absolute left-20 top-0 md:min-w-[13rem] md:max-w-[15rem] md:w-fit md:bg-white md:shadow-lg md:pl-2'
                            : 'md:pl-[3.30rem]'
                        } pl-10  bg-slate-100 rounded-md`}
                      >
                        {c.isOpen == true &&
                          c.child.map((e, f) => {
                            return (
                              <li
                                className="h-8 flex flex-col justify-center w-full hover:bg-slate-100 px-2 rounded "
                                key={f}
                              >
                                <span className="hover:text-melrose-400">{e.name}</span>
                              </li>
                            );
                          })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>

      <div className={`${!isOpen && 'md:hidden'} w-full px-2 mt-auto mb-16`}>
        <div className="w-full border-2 border-dashed rounded-md flex justify-center items-center h-32">
          <h2>Ads</h2>
        </div>
      </div>

      <div className={`${!isOpen && 'md:hidden'} absolute bottom-5 left-0 inline-flex gap-4 pl-5`}>
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
