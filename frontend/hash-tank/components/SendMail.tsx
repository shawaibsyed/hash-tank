import { AppDispatch, RootState } from "@/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Fuse from 'fuse.js'
import { fetchData } from "@/slice/SearchSlice";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar, Divider, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemText, Paper } from "@mui/material";
// import { Link } from "phosphor-react";
import { API } from "@/constants/api.constants";
import { SealCheck } from "@phosphor-icons/react";
import Link from "next/link";

function getRandomColor() {
  // Generate random RGB values
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

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

export default function SendMail({ subject, body }: any) {

  subject = subject || 'HashTank'
  body = body || ''

  const createPeopleList = (peopleSearch: any[]) => {
    return (
      <>
        {peopleSearch &&
          peopleSearch.map((people: any, index: number) => (
            <a
              href={`mailto:${people.email}?subject=${encodeURIComponent(subject)}&body=${body}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "black" }}
              key={people.userId}
            >
              <React.Fragment key={people.userId}>
                <Divider component="li" />
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      src={`${API.BASE_URL}${API.GET_PROFILE_PIC.route}/${people.profilePic}`}
                      alt={people.name}
                      style={{
                        ...getRandomColor(),
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
                          <SealCheck
                            size={16}
                            color="#00a3f5"
                            weight="fill"
                            style={{ marginLeft: "5px", top: "3px" }}
                          />
                        )}
                      </>
                    }
                    secondary={people.email}
                  />
                </ListItem>
              </React.Fragment>
            </a>
          ))}
      </>
    );
  };

  const [searchQuery, setSearchQuery] = useState<string>("");
  const { searchbase } = useSelector((state: RootState) => state.searchbase);
  const dispatch = useDispatch<AppDispatch>();
  const [isFocused, setIsFocused] = useState(true);

  const [peopleSearch, setPeopleSearch] = useState<any[]>([]);

  const handleSearchQueryChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchQuery(event.target.value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const placeholderText = isFocused
    ? "You can look for person's name, email or username"
    : "Search";

  const createSearchList = () => {
    console.log(searchQuery);
    if (searchQuery) {
      const fusePeople = new Fuse(searchbase.people, {
        keys: ["username", "name", "email", "role"],
      });

      const peopleResult = fusePeople
        .search(searchQuery)
        .map((result) => result.item);
      setPeopleSearch(peopleResult);

    }
  };

  useEffect(() => {
    if (!searchbase) dispatch(fetchData());
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery) {
      const timeout = setTimeout(createSearchList, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [searchQuery]);

  return (
    <>
      <div>
        <Paper
          component="form"
          sx={{
            position: "absolute",
            top: "calc((64px - 2.2rem) / 2)",
            left: "calc(50% - 15rem)",
            display: "flex",
            alignItems: "center",
            width: "30rem",
            borderColor: "white",
            maxHeight: "2.2rem",
          }}
        >
          <InputBase
            autoFocus
            sx={{ ml: 1, flex: 1, padding: "1rem" }}
            placeholder={placeholderText}
            inputProps={{ "aria-label": "search" }}
            onChange={handleSearchQueryChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton
            type="button"
            sx={{ p: "10px", color: "var(--button-color)" }}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </div>
      {searchQuery && (
        <Paper
          style={{
            position: "absolute",
            top: "calc(64px - (64px - 2.2rem) / 2 - 5px)",
            left: "calc(50% - 15rem)",
            borderRadius: "4px",
            minWidth: "30rem",
          }}
        >
          <List
            sx={{
              paddingTop: "17px",
              maxWidth: "30rem",
              minWidth: "30rem",
              bgcolor: "background.paper",
              maxHeight: "40vh",
              overflowY: "auto",
              borderRadius: "4px",
              "&::-webkit-scrollbar": {
                width: "3px", // Set the width of the scrollbar to 3px
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "gray", // Set the color of the scrollbar thumb
              },
            }}
          >
            {createPeopleList(peopleSearch)}
          </List>
        </Paper>
      )}
    </>
  );
};