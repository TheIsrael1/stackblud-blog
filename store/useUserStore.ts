import { userSchema } from '../types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import z from 'zod';

const userStoreSchema = userSchema.extend({
  authenticated: z.boolean(),
  setAuthenticated: z.function().args(z.boolean()).returns(z.void()),
  setUserName: z.function().args(z.string()).returns(z.void())
});

type userStoreSchemaInterface = z.infer<typeof userStoreSchema>;

const useUserStore = create<userStoreSchemaInterface>()(
  persist(
    (set) => ({
      userName: `Guest`,
      id: 1,
      authenticated: false,
      setAuthenticated: (arg) =>
        set((state) => ({
          authenticated: arg
        })),
      setUserName: (arg) =>
        set((state) => ({
          userName: arg
        }))
    }),
    {
      name: 'user-storage'
    }
  )
);

export default useUserStore;
