import { create } from 'zustand'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3000' : '/';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  errors: {},
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data.user });
       get().connectSocket();
    } catch (error) {
      console.log(`Erron in check auth ${error.message}`)
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      set({ authUser: res.data.user });
      toast.success("Account created successfully");
       get().connectSocket();
    } catch (error) {
      const message = error?.response?.data?.message;
      if (message) {
        set({
          errors: {
            exists: message
          }
        });
      }
      const errors = error?.response?.data?.errors;
      if (errors) {
        set({ errors: errors })
      }
    } finally {
      set({ isSigningUp: false })
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true })
    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({ authUser: res.data.user });
      toast.success("Login successfully");
      get().connectSocket();
    } catch (error) {
      const message = error?.response?.data?.message;
      if (message) {
        toast.error(message);
      }
      const errors = error?.response?.data?.errors;
      if (errors) {
        set({ errors: errors })
      }
    } finally {
      set({ isLoggingIn: false })
    }
  },

  logout: async () => {
    try {
      await axiosInstance.get('/auth/logout');
      set({ authUser: null });
      toast.success('Logout Successfully');
      get().disconnectSocket();
    } catch (error) {
      console.log(error);
      toast.error('Something wrong');
    }
  },

  updateProfile: async (data) => {
    console.log('Data is :', data)
    try {
      set({ isUpdatingProfile: true });
      const config = data instanceof FormData ? {} : {
        headers: { 'Content-Type': 'application/json' }
      };

      const res = await axiosInstance.put('/auth/profile', data, config);
      console.log(res);
      toast.success('Updated Successfully');
      set({ authUser: res.data.updatedUser });
    } catch (error) {
      console.log(`Error form updating profile ${error}`);
      toast.error('Photo size is too large');
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    // if he connected or not auth
    if (!authUser || get().socket?.connected) return;
    
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id
      }
    });
    socket.connect();
    set({ socket: socket });

    socket.on('getOnlineUsers', (userIds) => {
        set({ onlineUsers: userIds })
    })
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  }

}))
