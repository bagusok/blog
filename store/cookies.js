import { atom, useAtomValue } from 'jotai';
import { parseCookies } from 'nookies';

export const jwtToken = atom(parseCookies().token || null);
