import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast, ToastBar, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useAtomValue } from 'jotai';
import { jwtToken } from '../../../store/cookies';
import { parseCookies } from 'nookies';

export default function Register() {
  const { register, handleSubmit } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const cookies = parseCookies();
  if (cookies.token) router.push('/user/post', undefined, { shallow: true });

  const handleRegister = async (e) => {
    console.log(e);
    setIsLoading(true);
    const login = await fetch('/api/v1/user/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(e),
    });

    try {
      const res = await login.json();
      if (res.status === true) {
        toast.success(res.message);
        setTimeout(() => {
          router.push('/user/auth/login', undefined, { shallow: true });
        }, 500);
        setIsLoading(false);
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
        <div className="md:w-1/2 flex flex-col items-center justify-center md:mt-0 mt-10 md:px-28 px-5">
          <h1 className="text-3xl font-semibold mb-2">Register</h1>
          <p className="text-sm font-regular text-slate-400 text-center mb-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto cumque ipsam nulla?
          </p>

          <form className="flex flex-col w-full" onSubmit={handleSubmit(handleRegister)}>
            <div className="form-group flex flex-col">
              <label htmlFor="full_name" className="text-sm font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="username"
                className="border border-slate-300 focus:bg-gray-100 text-sm p-1 rounded-sm mb-3 h-10"
                {...register('full_name')}
                required
              />
            </div>
            <div className="form-group flex flex-col">
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
            </div>
            <div className="form-group flex flex-col">
              <label htmlFor="email" className="text-sm font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="border border-slate-300 focus:bg-gray-100 text-sm p-1 rounded-sm mb-3 h-10"
                {...register('email')}
                required
              />
            </div>
            <div className="form-group flex flex-col">
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
            </div>

            <button
              type="submit"
              className="rounded-sm px-2 py-1 bg-orange-500 text-md font-semibold text-white h-10 mt-2 hover:opacity-80"
            >
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>

          <p className="text-xs mt-5 font-normal">
            Dont have an account?{' '}
            <Link href="/user/auth/login" className="text-sm text-orange-500 hover:opacity-80 font-regular">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
