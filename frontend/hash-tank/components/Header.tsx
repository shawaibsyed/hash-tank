import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, Badge, IconButton, Menu, MenuItem, Modal } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import SearchBar from "./SearchBar";
import {
  CloudUpload,
  Telegram,
  PersonSharp,
  NotificationsSharp,
} from "@mui/icons-material";
import Notification from "./Notification";
import { useSocket } from "@/context/socket.provider";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import SendMail from "./SendMail";
import { API } from "@/constants/api.constants";
import { fetchProfile } from "@/slice/ProfileSlice";

function getRandomColor(uniqueString: string) {
  if (!uniqueString) {
    uniqueString = "A";
  }
  const hash = uniqueString.split("").reduce((acc: any, char: any) => {
    acc = char.charCodeAt(0) + ((acc << 5) - acc);
    return acc & acc;
  }, 0);

  // Calculate RGB values from the hash
  const r = (hash >> 16) & 0xff;
  const g = (hash >> 8) & 0xff;
  const b = hash & 0xff;

  // Calculate color brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Set text color based on brightness
  const textColor = brightness > 125 ? "#000000" : "#ffffff";

  // Return color object with background and text colors
  return {
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
    color: textColor,
  };
}

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>(null);
  const [notificationModal, setNotificationModal] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState<Number>(0);
  const { notification } = useSelector(
    (state: RootState) => state.notification
  );
  const [openMail, setOpenMail] = React.useState(false);
  const { profile } = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (profile.length == 0) {
      dispatch(fetchProfile());
    }
  }, []);

  const socket = useSocket();

  const handleCloseModal = () => {
    setNotificationModal(false);
  };

  const handleOpenModal = () => {
    setNotificationModal(true);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget as unknown as SVGSVGElement | null);
  };
  
  

  const handleOpenMail = () => {
    setOpenMail(true);
  };

  const handleCloseMail = () => {
    setOpenMail(false);
  };

  const { logout } = useAuth();

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    socket.on("notification", (payload: any) => {
      setNotificationCount((notificationCount as number) + 1);
    });

    return () => {
      socket.off("notification");
    };
  }, [socket]);

  useEffect(() => {
    if (notification)
      setNotificationCount(
        notification.filter((notif: any) => !notif.status).length
      );
  }, [notification]);

  // useEffect(() => {
  //   // Update hasUnreadNotifications based on actual logic or state
  //   const hasUnread = true; // Replace with your actual logic to determine if there are any unread notifications
  //   setHasUnreadNotifications(hasUnread);
  // }, []);

  // // Update hasUnreadNotifications whenever there is a real-time change
  // useEffect(() => {
  //   // Simulating a real-time change by updating hasUnreadNotifications every 5 seconds
  //   const interval = setInterval(() => {
  //     const hasUnread = Math.random() < 0.5; // Replace with your actual real-time update logic
  //     setHasUnreadNotifications(hasUnread);
  //   }, 5000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background:
          "linear-gradient(269.99deg, #387091 0.12%, #165E79 30.83%, #003E55 66.29%, #003E55 95.9%)",
        height: "4rem",
      }}
    >
      {notificationModal && (
        <Modal
          open={notificationModal}
          onClose={handleCloseModal}
          sx={{
            fontSize: 32,
            color: "white",
            cursor: "pointer",
          }}
        >
          <Notification
            onClose={handleCloseModal}
            setNotificationCount={setNotificationCount}
          />
        </Modal>
      )}
      <div>
        <Link href="/homePage" style={{ textDecoration: "none" }}>
          <h2
            style={{
              marginLeft: "4rem",
              color: "white",
              fontSize: "2rem",
              fontFamily: "'Abril Fatface', cursive",
            }}
          >
            HA$HTANK
          </h2>
        </Link>
      </div>
      <div style={{ flex: 1, textAlign: "center" }}>
        <SearchBar />
      </div>
      <div style={{ display: "flex" }}>
        <Link href="/uploadPitch">
          <CloudUpload
            sx={{
              color: "white",
              fontSize: 32,
              padding: "3px",
              marginRight: "1rem",
            }}
          />
        </Link>
        <Modal open={openMail} onClose={handleCloseMail}>
          <SendMail />
        </Modal>
        <Telegram
          onClick={handleOpenMail}
          sx={{
            color: "white",
            fontSize: 32,
            padding: "3px",
            marginRight: "1rem",
            cursor: "pointer",
          }}
        />
      </div>
      <div>
        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginRight: "1rem",
          }}
        >
          {/* <Badge badgeContent={notificationCount as number} color="primary"> */}
          <Badge
            color="error"
            variant="dot"
            invisible={(notificationCount as number) == 0}
          >
            <NotificationsSharp
              onClick={handleOpenModal}
              sx={{
                color: "white",
                fontSize: 32,
                padding: "-5px",
                cursor: "pointer",
              }}
            />
          </Badge>
          {/* {hasUnreadNotifications && (
            <div
              style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                width: "5px",
                height: "5px",
                backgroundColor: "red",
                borderRadius: "50%",
              }}
            ></div>
          )} */}
        </div>
      </div>
      <div>
        {/* <PersonSharp
          sx={{
            fontSize: 32,
            color: "white",
            padding: "3px",
            cursor: "pointer",
            marginRight: "2rem",
          }}
          onClick={handleMenuOpen}
        /> */}
        <IconButton onClick={(e) => handleMenuOpen(e)}>
          <Avatar
            src={`${API.BASE_URL}${API.GET_PROFILE_PIC.route}/${profile.profilePic}`}
            alt={profile.name}
            
            style={{
              width: "36px",
              height: "36px",
              marginRight: "2rem",
              ...getRandomColor(profile.userId),
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
            
          >
            {profile.name ? profile.name.charAt(0) : ""}
          </Avatar>
          </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Link
            href="/profilePage"
            style={{ textDecoration: "none", color: "var(--button-color)" }}
          >
            <MenuItem onClick={handleMenuClose}>View Profile</MenuItem>
          </Link>
          <Link
            href="/editProfile"
            style={{ textDecoration: "none", color: "var(--button-color)" }}
          >
            <MenuItem onClick={handleMenuClose}>Edit Profile</MenuItem>
          </Link>
          <Link
            href="/investmentPanel"
            style={{ textDecoration: "none", color: "var(--button-color)" }}
          >
            <MenuItem onClick={handleMenuClose}>Investment Panel</MenuItem>
          </Link>
          <Link
            href="/login"
            style={{ textDecoration: "none", color: "var(--button-color)" }}
          >
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Link>
        </Menu>
      </div>
    </div>
  );
};

export default Header;
