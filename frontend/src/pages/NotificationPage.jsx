import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore"
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Bell } from "lucide-react";
import SidebarSkeleton from "../components/skeletons/SidebarSkeleton";

export default function Notification() {
  const { notifications, getNotifications, clearNotifications, setSelectedUser, deleteNotifications } = useChatStore();
  const [refresh, setRefresh] = useState(false);
  const { onlineUsers } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    getNotifications();
    clearNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, getNotifications]);


  const handleClick = (e, senderId) => {
    setSelectedUser(senderId);
    deleteNotifications();
    navigate('/');
  }

  const handleDelete = () => {
    deleteNotifications();
    setRefresh(true);
  };

  if (!notifications) {
    return (
      <SidebarSkeleton />
    )
  }

  return (
    <div className="min-h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between mt-4">
          <h1 className="text-2xl md:text-5xl font-bold">Notifications</h1>
          { notifications && notifications.length > 0 && (
            <button onClick={handleDelete} type="submit" className="btn">Delete All</button>
          ) }
        </div>
        <div className={`${notifications.length > 0 && 'h-[calc(100vh-200px)] overflow-y-scroll'} flex flex-col gap-2`}>
          {notifications && notifications.length > 0 ? (
            notifications.map((notfication) => (
              <div
                onClick={(e) => handleClick(e, notfication.senderId)}
                key={notfication._id}
                className="bg-base-300 rounded-lg p-4 cursor-pointer hover:bg-base-200 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  {/* Profile Picture */}
                  <div className="relative">
                    <img
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                      src={notfication.senderId.profilePic || './avatar.jpg'}
                      alt="Sender Profile Pic"
                    />
                    {onlineUsers.includes(notfication.senderId._id) && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="font-semibold text-base truncate pr-2">
                        {notfication.senderId.fullName}
                      </h2>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {new Date(notfication.createdAt).toLocaleTimeString('en', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                      {notfication.text || 'Sent an image'}
                    </p>

                    <p className="text-xs text-gray-400">
                      {notfication.senderId.email}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 flex flex-col items-center justify-center gap-2">
              <Bell className="size-9" />
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
