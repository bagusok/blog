import { useSetAtom } from 'jotai';
import { Router } from 'next/router';
import { destroyCookie } from 'nookies';
import { jwtToken } from '../store/cookies';

export default function handleNotAuthentication(router) {
  destroyCookie('null', 'token');
  router.push('/user/auth/login', undefined, { shallow: true });
}
