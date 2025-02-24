import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDistanceToNow } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchNotification, updateAll, updateNotification } from "@/slice/NotificationSlice";
import { useSocket } from "@/context/socket.provider";
import { API } from "@/constants/api.constants";

interface NotificationData {
  notificationId: string;
  profilePic: string;
  name: string;
  message: string;
  timestamp: string;
  status: boolean;
}

const sortNotification = (notifications: NotificationData[]) => {
  if (!notifications) {
    return [];
  }
  const unreadNotifications = notifications
    .filter((notification) => !notification.status)
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const readNotifications = notifications
    .filter((notification) => notification.status)
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return [...unreadNotifications, ...readNotifications];
};

const getUnreadNotificationsCount = (notifications: NotificationData[]) => {
  if (!notifications || notifications.length === 0) {
    return 0;
  }

  return notifications.filter((notification) => !notification.status).length;
};

function Notification({ onClose, hasNotification, setNotificationCount }: any) {
  const socket = useSocket();
  const { enqueueSnackbar } = useSnackbar();
  const { notification } = useSelector((state: RootState) => state.notification);
  const dispatch = useDispatch<AppDispatch>();

  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    dispatch(fetchNotification());
  }, [dispatch]);

  useEffect(() => {
    const sortedNotification = sortNotification(notification);
    setNotifications(sortedNotification);
    setNotificationCount(notification ? notification.filter(
      (notif: any) => !notif.status
    ).length : 0);
  }, [notification]);

  useEffect(() => {
    socket.on("notification", (payload: any) => {
      dispatch(updateNotification(payload));
    });

    // return () => {
    //   socket.off("notification");
    // };
  }, [socket]);

  useEffect(() => {
    setNotificationCount(notifications.filter(
      (notif: any) => !notif.status
    ).length);
  }, [notifications])

  const handleDeleteNotification = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notify) => notify.notificationId !== id)
    );

    fetch(API.BASE_URL + API.DELETE_NOTIFICATION.route + `/${id}`, {
      method: API.DELETE_NOTIFICATION.method,
      headers: {
        authorization: localStorage.getItem("idToken") || "",
      },
    });
  };

  const handleNotificationClick = (id: string) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.map((notify) => {
        if (notify.notificationId === id) {
          fetch(API.BASE_URL + API.TOGGLE_NOTIFICATION.route + `/${id}`, {
            method: API.TOGGLE_NOTIFICATION.method,
            headers: {
              authorization: localStorage.getItem("idToken") || "",
            },
          });
        }

        return notify.notificationId === id
          ? { ...notify, status: !notify.status }
          : notify;
      });

      const sortedNotification = sortNotification(updatedNotifications);
      return sortedNotification;
    });
  };

  const formatTimeAgo = (time: any) => {
    return formatDistanceToNow(new Date(time), { addSuffix: true });
  };

  const unreadNotificationsCount = notifications.filter(
    (notification) => !notification.status
  ).length;

  const renderUnreadNotificationsCount = () => {
    if (unreadNotificationsCount === 0) {
      return null;
    }

    return (
      <div
        style={{
          backgroundColor: "black",
          color: "white",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        {unreadNotificationsCount}
      </div>
    );
  };

  return (
    <>
      <Modal
        open
        onClose={onClose}
        hideBackdrop={true}
        style={{
          position: "absolute",
          left: "72%",
          top: "4.5rem",
          height: "60%",
          width: "80%",
          maxWidth: "500px",
          backgroundColor: "#ffffff",
          borderRadius: "0.5rem",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          zIndex: 9999,
        }}
      >
        <>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              padding: "1rem",
              borderBottom: "1px solid #ddd",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              color:"grey",
              borderRadius:"0.5rem"
            }}
          >
            Notifications{" "}
            <span style={{ marginLeft: "0.5rem" }}>
              {renderUnreadNotificationsCount()}
            </span>
          </Typography>
          <div
            style={{
              maxHeight: "calc(100% - 145px)",
              overflowY: "scroll",
              padding: "1rem",
              scrollbarWidth: "thin",
              scrollbarColor: "#ddd transparent",
              backgroundColor: "#fff", // Set background color to white
            }}
          >
            <style>
              {`
                ::-webkit-scrollbar {
                  width: 8px;
                }

                ::-webkit-scrollbar-track {
                  background-color: transparent;
                }

                ::-webkit-scrollbar-thumb {
                  background-color: #ddd;
                  border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb:hover {
                  background-color: #bbb;
                }
              `}
            </style>
            <Stack spacing={1}>
              {notifications &&
                notifications.map((notify) => (
                  <React.Fragment key={notify.notificationId}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: !notify.status
                          ? "transparent"
                          : "#f0f0f0",
                        cursor: "pointer",
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                        transition: "background-color 0.3s",
                        "&:hover": {
                          backgroundColor: "#e8e8e8",
                        },
                      }}
                      onClick={() =>
                        handleNotificationClick(notify.notificationId)
                      }
                    >
                      <Avatar
                        src={notify.profilePic}
                        alt={notify.name}
                        sx={{
                          ...(notify.status
                            ? { border: "2px solid green" }
                            : { border: "2px solid red" }),
                          marginRight: "10px",
                          width: "40px",
                          height: "40px",
                        }}
                      />
                      <Box sx={{ flexGrow: 1, ml: 2 }}>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "bold" }}
                        >
                          {notify.name}
                        </Typography>
                        <Typography variant="body2">
                          {notify.message}
                        </Typography>
                        <Typography variant="caption">
                          {formatTimeAgo(notify.timestamp)}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() =>
                          handleDeleteNotification(notify.notificationId)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </React.Fragment>
                ))}
            </Stack>
          </div>
        </>
      </Modal>
    </>
  );
}

export default Notification;