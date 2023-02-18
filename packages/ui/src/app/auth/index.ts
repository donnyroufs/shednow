import { create } from "zustand";
import { axios } from "../core/axios";
import { useEffect } from "react";

type UserDto = {
  avatarUrl?: string;
  name: string;
  email: string;
  id: string;
};

type AuthStore = {
  user: UserDto | null;
  fetchMe(): Promise<void>;
  isAuthenticated(): boolean;
  logout(): Promise<void>;
};

const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  fetchMe: async () => {
    const response = await axios.get("/auth/me");
    const user = response.status === 200 ? JSON.parse(response.data) : null;

    set({
      user,
    });
  },
  isAuthenticated: () => Boolean(get().user),
  logout: async () => {
    await axios.delete("/auth/logout");
    set({ user: null });
  },
}));

export function useAuth(loadUser = false) {
  const store = useAuthStore();

  useEffect(() => {
    if (!loadUser) return;
    if (store.user) return;

    store.fetchMe();
  }, [loadUser]);

  return {
    fetchMe: store.fetchMe,
    user: store.user,
    isAuthenticated: store.isAuthenticated(),
    logout: store.logout,
  };
}
