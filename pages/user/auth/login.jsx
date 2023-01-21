import { useState } from 'react';
import nookies, { parseCookies, setCookie } from 'nookies';
import { useAtomValue, useSetAtom } from 'jotai';
import { jwtToken } from '../../../store/cookies';
import { AiFillFacebook, AiFillGoogleCircle } from 'react-icons/ai';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast, ToastBar, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';

export default function Login() {
  const { register, handleSubmit } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const setToken = useSetAtom(jwtToken);
  const cookies = parseCookies();
  // if (cookies.token) router.push('/user/post', undefined, { shallow: true });

  const handleLogin = async (e) => {
    console.log(e);
    setIsLoading(true);
    const login = await fetch('/api/v1/user/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(e),
    });

    try {
      const res = await login.json();
      if (res.status === true) {
        setCookie(null, 'token', res.token, {
          path: '/',
          maxAge: 30 * 24 * 60 * 60,
        });
        setToken(res.token);
        toast.success(res.message);

        router.reload();
      } else {
        toast.error(res.message);
        setIsLoading(false);
      }
      console.log(res);
    } catch (err) {
      toast.error(err.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex md:flex-row">
        <div className="md:w-2/3 hidden md:block bg-orange-400 min-h-screen"></div>
        <div className="md:w-1/2 flex flex-col items-center md:min-h-screen md:mt-0 mt-10 justify-center md:px-28 px-5">
          <h1 className="text-3xl font-semibold mb-2">Login</h1>
          <p className="text-sm font-regular text-slate-400 text-center mb-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto cumque ipsam nulla?
          </p>

          <form className="flex flex-col w-full" onSubmit={handleSubmit(handleLogin)}>
            <label htmlFor="username" className="text-sm font-semibold mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="border border-slate-300 focus:bg-gray-100 text-sm p-1 rounded-sm mb-3 h-10"
              {...register('username')}
              required
            />
            <label htmlFor="passsword" className="text-sm font-semibold mb-1">
              Password
            </label>
            <input
              type="text"
              name="password"
              className="border border-slate-300 focus:bg-gray-100 text-sm p-1 rounded-sm mb-3 h-10"
              {...register('password')}
              required
            />

            <button
              type="submit"
              className="rounded-sm px-2 py-1 bg-orange-500 text-md font-semibold text-white h-10 mt-2 hover:opacity-80"
            >
              {isLoading ? 'Loading...' : 'Login'}
            </button>
            <button
              type="button"
              className="rounded-sm px-2 py-1 text-sm font-semibold h-10 border border-slate-300 hover:bg-gray-100 mt-2"
            >
              Login with Facebook <AiFillFacebook className="inline-block text-xl self-center text-blue-500" />
            </button>
            <button
              type="button"
              className="rounded-sm px-2 py-1 text-sm font-semibold h-10 border border-slate-300 hover:bg-gray-100 mt-2"
            >
              Login with Google <AiFillGoogleCircle className="inline-block text-xl self-center text-red-500" />
            </button>
          </form>

          <p className="text-xs mt-5 font-normal">
            Dont have an account?{' '}
            <Link href="/user/auth/register" className="text-sm text-orange-500 hover:opacity-80 font-regular">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export function getServerSideProps(ctx) {
  const cookies = parseCookies(ctx);
  if (cookies.token) {
    return {
      redirect: {
        destination: '/user/post',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
