import store from 'store';
import { USER_KEY } from '@/constants';
import type { IUserInfo } from '@/types';

export const setUser = (data: IUserInfo) => {
  store.set(USER_KEY, data);
};

export const getUser = (key?: string): IUserInfo | any => {
  const user: IUserInfo = store.get(USER_KEY);
  return key ? user[key] : user;
};

export const clearUser = (): void => {
  store.remove(USER_KEY);
};
