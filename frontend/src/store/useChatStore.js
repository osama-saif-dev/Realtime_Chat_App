import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    notifications: [],
    notificationsCount: 0,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/message/users');
            set({ users: res.data.filteredUsers });
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data.messages });
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    getNotifications: async () => {
        try {
            const res = await axiosInstance.get('/message/notifications');
            set({ notifications: res.data.notifications })
        } catch (error) {
            console.log(error);
        }
    },

    deleteNotifications: async () => {
        try {
            await axiosInstance.delete('/message/delete');
        } catch (error) {
            console.log(error);
        }
    },

    sendMessage: async (data) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, data);
            set({ messages: [...messages, res.data.message] });
        } catch (error) {
            console.log(error);
            toast.error('Photo size is too large');
        }
    },

    subscribeToNotifications: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        try {
            socket.on('notification', (message) => {
                const currentNotifications = get().notifications || [];
                set({
                    notifications: [...currentNotifications, message],
                    notificationsCount: [message].length
                });

                try {
                    const audio = new Audio('/audio.wav');
                    audio.volume = 0.5
                    audio.play().catch(err => console.log('Error playing sound:', err));
                } catch (error) {
                    console.log(error)
                }

            });
        } catch (error) {
            console.log(error);
        }
    },

    clearNotifications: () => {
        set({ notificationsCount: [] });
    },

    unsubscribeToNotifications: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
        socket.off("notification");
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        socket.on('newMessage', (newMessage) => {
            if (newMessage.senderId != selectedUser._id) return;
            set({ messages: [...get().messages, newMessage] });
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (user) => set({ selectedUser: user }),
}))