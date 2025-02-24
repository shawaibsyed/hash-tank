import Link from "next/link";
import styles from "../styles/sidebar.module.css";
import { House, Users, TrendUp, SealCheck } from "@phosphor-icons/react";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchConnection } from "@/slice/ConnectionsSlice";
import { useEffect } from "react";
import React from "react";
import { API } from "@/constants/api.constants";

function getRandomColor(uniqueString: string) {
  if(!uniqueString){
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

const createConnectionList = (connections: any[]) => {
  return (
    <>
      {connections &&
        connections.map((people: any, index: number) => (
          <Link
            href={`/profilePage/${people.userId}/product/all`}
            style={{ textDecoration: "none", color: "black" }}
            key={people.userId}
          >
            <React.Fragment key={people.userId}>
              <ListItem alignItems="flex-start" style={{ paddingLeft: "25px" }}>
                <ListItemAvatar>
                <Avatar
                    src={`${API.BASE_URL}${API.GET_PROFILE_PIC.route}/${people.profilePic}`}
                    alt={people.name}
                    style={{
                      ...getRandomColor(people.userId),
                      // fontSize: "18px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {people.name ? people.name.charAt(0) : ""}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      {people.username}
                      {people.role === "titan" && (
                        <SealCheck size={16} color="#00a3f5" weight="fill" />
                      )}
                    </>
                  }
                  secondary={people.name}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          </Link>
        ))}
    </>
  );
};

function SideBar() {
  const dispatch = useDispatch<AppDispatch>();
  const { connection } = useSelector((state: RootState) => state.connection);

  useEffect(() => {
    if (connection.length == 0) dispatch(fetchConnection());
  }, [dispatch, connection]);

  return (
    <div className={styles.container}>
      <Paper
        style={{
          borderRadius: "0px",
          height: "100%",
          width: "100%",
        }}
      >
        <Typography
          variant="h6"
          className="gradient-text"
          style={{
            fontSize: "var(--fs-sub-heading)",
            textAlign: "center",
            marginTop: "23px",
          }}
        >
          CONNECTIONS
        </Typography>
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            height: "100%",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "3px", // Set the width of the scrollbar to 3px
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "gray", // Set the color of the scrollbar thumb
            },
          }}
          // subheader={
          //   <ListSubheader
          //     component="div"
          //     style={{
          //       // backgroundColor: "var(--button-color)",
          //       fontSize: "var(--fs-sub-heading)",
          //       textAlign: "center",
          //       marginTop: "23px",
          //       width: "100%",
          //       color: "rgb(56, 159, 194)"
          //     }}
          //   >
          //     Connections
          //   </ListSubheader>
          // }
        >
          {createConnectionList(connection.following)}
        </List>
      </Paper>
    </div>
  );
}

export default SideBar;
