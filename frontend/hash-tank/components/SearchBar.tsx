import React, { useEffect, useState } from "react";
import {
  IconButton,
  Paper,
  InputBase,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchData } from "@/slice/SearchSlice";
import { fetchtags } from "@/slice/TagsSlice";
import Fuse from "fuse.js";
import { API } from "@/constants/api.constants";
import { Tag, ViewInAr } from "@mui/icons-material";
import Link from "next/link";
import { SealCheck } from "@phosphor-icons/react";
import { fetchProfile } from "@/slice/ProfileSlice";

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


const createPeopleList = (peopleSearch: any[]) => {

  return (
    <>
      {peopleSearch &&
        peopleSearch.map((people: any, index: number) => (
          <Link
            href={`/profilePage/${people.userId}/product/all`}
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
          </Link>
        ))}
    </>
  );
};

const createTagsList = (tagsSearch: any[]) => {
  return (
    <>
      {tagsSearch &&
        tagsSearch.map((tag: any, index: number) => (
          <Link
            href={{ pathname: "/", query: { tag: tag } }}
            style={{ textDecoration: "none", color: "black" }}
            key={tag}
          >
            <React.Fragment key={tag}>
              <Divider component="li" />
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Tag />
                </ListItemAvatar>
                <ListItemText primary={tag} />
              </ListItem>
            </React.Fragment>
          </Link>
        ))}
    </>
  );
};

const createProductList = (productSearch: any[]) => {
  return (
    <>
      {productSearch &&
        productSearch.map((prod: any, index: number) => (
          <Link
            href={`/profilePage/${prod.userId}/product/${prod.prodName}`}
            style={{ textDecoration: "none", color: "black" }}
            key={prod.prodName}
          >
            <React.Fragment key={prod.prodName}>
              <Divider component="li" />
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <ViewInAr />
                </ListItemAvatar>
                <ListItemText primary={prod.prodName} />
              </ListItem>
            </React.Fragment>
          </Link>
        ))}
    </>
  );
};

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { searchbase } = useSelector((state: RootState) => state.searchbase);
  const { tags } = useSelector((state: RootState) => state.tags);
  const [isFocused, setIsFocused] = useState(false);

  const [peopleSearch, setPeopleSearch] = useState<any[]>([]);
  const [tagsSearch, setTagsSearch] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState<any[]>([]);

  const { profile } = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if(profile.length == 0) {
      dispatch(fetchProfile());
    }
  },[])

  const handleSearchQueryChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    // console.log(event.target.value);
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    console.log("Search Query:", searchQuery);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 500);
  };

  const handleContainerBlur = () => {
    setIsFocused(true);
  };

  const placeholderText = isFocused
    ? "You can look for people, product and tags"
    : "Search";

  const createSearchList = () => {
    console.log(searchQuery);
    if (searchQuery && searchbase) {
      const fusePeople = new Fuse(searchbase.people, {
        keys: ["username", "name", "email", "role"],
        includeScore: true,
      });

      const fuseTags = new Fuse(tags, {
        includeScore: true,
      });

      const filteredProduct = searchbase.product.filter((prod: any) =>  (
        profile.role == 'titan' || (profile.role == 'pitcher' && prod.isPublic))
      );

      const fuseProduct = new Fuse(filteredProduct, {
        keys: ["prodName"],
        includeScore: true,
      });

      const peopleResult = fusePeople
        .search(searchQuery)
        .filter((result) => result.score as number < 0.1)
        .sort((a, b) => ((a.score as number) - (b.score as number)))
        .map((result) => result.item);
      setPeopleSearch(peopleResult);

      const tagsResult = fuseTags
        .search(searchQuery)
        .filter((result) => result.score as number < 0.3)
        .sort((a, b) => ((a.score as number) - (b.score as number)))
        .map((result) => result.item);
      setTagsSearch(tagsResult);

      const productResult = fuseProduct
        .search(searchQuery)
        .filter((result) => result.score as number < 0.2)
        .sort((a, b) => ((a.score as number) - (b.score as number)))
        .map((result) => result.item);
      setProductSearch(productResult);

      // console.log([...peopleResult, ...tagsResult, ...productResult]);
    }
  };

  useEffect(() => {
    if (!searchbase) dispatch(fetchData());
    if (!tags) dispatch(fetchtags());
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
      <div >
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
      {searchQuery && isFocused &&  (
        <Paper
          style={{
            position: "absolute",
            top: "calc(64px - (64px - 2.2rem) / 2 - 5px)",
            left: "calc(50% - 15rem)",
            borderRadius: "4px",
            minWidth: "30rem",
            zIndex: '10',
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
              zIndex: '10',
              "&::-webkit-scrollbar": {
                width: "3px", // Set the width of the scrollbar to 3px
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "gray", // Set the color of the scrollbar thumb
              },
            }}
          >
            {createPeopleList(peopleSearch)}
            {createProductList(productSearch)}
            {createTagsList(tagsSearch)}
          </List>
        </Paper>
      )}
    </>
  );
};

export default SearchBar;
