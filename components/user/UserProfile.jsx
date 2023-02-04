import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiOutlineUser, AiOutlineLogout } from 'react-icons/ai';
import { destroyCookie } from 'nookies';

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const handleLogout = () => {
    console.log('logout');

    destroyCookie(null, 'token', {
      path: '/',
    });
    router.push('/user/auth/login');
  };

  return (
    <>
      <div className="flex self-center rounded py-2" onClick={() => setIsOpen((prev) => !prev)}>
        <Image
          alt="Profile"
          src="/images/avatar.png"
          width={50}
          height={50}
          className="rounded-md object-cover h-auto w-[40px]"
        />

        {isOpen && (
          <ul className="absolute z-50 right-2 top-16 flex flex-col p-2 rounded-md shadow-md bg-white">
            <li className="inline-flex gap-2 items-center text-center rounded px-2 py-1 font-semibold hover:bg-orange-400">
              <AiOutlineUser /> <span>Profile</span>
            </li>
            <li
              onClick={() => handleLogout()}
              className="inline-flex gap-2 items-center text-center rounded px-2 py-1 font-semibold hover:bg-orange-400"
            >
              <AiOutlineLogout /> <span>Logout</span>
            </li>
          </ul>
        )}
      </div>
    </>
  );
}
