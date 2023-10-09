import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export const processError = (err: any) => {
  // in practicality I would extend axios error with the api's error interface
  const error = err as AxiosError;
  toast.error(`Error, ${error?.message}`);
};
