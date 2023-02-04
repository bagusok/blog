import Link from 'next/link';
import { BiArrowBack, BiNews } from 'react-icons/bi';
import { RxHamburgerMenu } from 'react-icons/rx';
import { AiOutlineSetting } from 'react-icons/ai';
import { HiOutlineDocument } from 'react-icons/hi';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import UserProfile from './UserProfile';

const sidebarIsOpen = atom(false);

export default function SideBar() {
  let sideBar = [
    {
      name: 'Blog Post',
      isActive: false,
      isOpen: false,
      icon: <BiNews className="text-lg" />,
      url: '/user/post',
    },
    {
      name: 'Blog Pages',
      isActive: false,
      isOpen: false,
      icon: <HiOutlineDocument className="text-lg" />,
      url: '/user/pages',
    },
    {
      name: 'Setting',
      isActive: false,
      isOpen: false,
      icon: <AiOutlineSetting className="text-lg" />,
      child: [
        {
          name: 'Navbar',
          url: '/user/settings/navbar',
          isActive: false,
        },
        {
          name: 'Seo',
          url: '/user/settings/seo',
          isActive: false,
        },
      ],
    },
  ];

  const [dataSidebar, setDataSidebar] = useState(sideBar);
  const router = useRouter();
  const getSidebarOpenValue = useAtomValue(sidebarIsOpen);
  const setSidebarOpenValue = useSetAtom(sidebarIsOpen);

  useEffect(() => {
    sideBar.forEach((a, b) => {
      if (router.pathname.includes(a.url)) {
        sideBar[b].isActive = true;
        setDataSidebar(sideBar);
      } else {
        a.child?.forEach((c, d) => {
          if (router.pathname.includes(c.url)) {
            sideBar[b].isActive = true;
            sideBar[b].isOpen = true;
            sideBar[b].child[d].isActive = true;
            setDataSidebar(sideBar);
          }
        });
      }
      setDataSidebar(sideBar);
    });
  }, [router.pathname]);

  const handleOpenChildSidebar = (a, i) => {
    sideBar[i].isOpen = a.isOpen ? false : true;
    sideBar[i].isActive = !a.isActive;
    if (a.child) {
      const childActive = sideBar[i].child?.findIndex((c, d) => {
        return router.pathname.includes(c.url);
      });
      childActive !== -1 && (sideBar[i].child[childActive].isActive = true);
    }
    setDataSidebar(sideBar);
  };

  return (
    <>
      <header className="max-w-screen w-full h-14 z-50 bg-white shadow-md flex justify-between items-center px-4 mb-5">
        <div>
          <RxHamburgerMenu className="text-2xl" onClick={() => setSidebarOpenValue((prev) => !prev)} />
        </div>
        <div className="flex relative">
          <UserProfile />
        </div>
      </header>
      {getSidebarOpenValue && (
        <aside className="w-64 z-50 min-h-screen fixed top-0 left-0 bg-gray-50 shadow-lg">
          <div className="overflow-y-auto px-3 rounded dark:bg-gray-800">
            <div className="inline-flex justify-between place-items-center mb-3 h-14 w-full">
              <a href="#" className="flex items-center ">
                <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">SanBlog</span>
              </a>
              <BiArrowBack className="text-xl" onClick={() => setSidebarOpenValue((prev) => !prev)} />
            </div>

            <ul>
              {dataSidebar?.map((a, i) => {
                return (
                  <li key={i} className="cursor-pointer">
                    {a.url ? (
                      <Link
                        href={!a.child ? a.url : ''}
                        className={`flex items-center p-2 pl-3 font-regular text-md rounded-lg hover:text-white hover:bg-orange-400 ${
                          dataSidebar[i].isActive ? `bg-orange-400 text-white` : 'text-gray-900'
                        }`}
                      >
                        {a.icon}
                        <span className=" ml-3 whitespace-nowrap">{a.name}</span>
                      </Link>
                    ) : (
                      <p
                        onClick={(e) => handleOpenChildSidebar(a, i)}
                        className={`flex items-center p-2 pl-3 font-regular text-md rounded-lg hover:text-white hover:bg-orange-400`}
                      >
                        {a.icon}
                        <span className="flex-1 ml-3 whitespace-nowrap">{a.name}</span>
                      </p>
                    )}
                    {a.child && a.isOpen && (
                      <ul className={'pl-14 rounded bg-gray-300/25 py-2'}>
                        {a.child?.map((b, i) => {
                          return (
                            <li key={i}>
                              <Link
                                href={b.url}
                                className={`text-sm font-regular text-gray-700 hover:text-orange-400 ${
                                  router.pathname.includes(b.url) && `text-orange-400`
                                }`}
                              >
                                {b.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      )}
    </>
  );
}
