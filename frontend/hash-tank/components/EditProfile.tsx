import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  Avatar,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Autocomplete,
  Box,
  Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { API } from "@/constants/api.constants";
import { fetchtags } from "@/slice/TagsSlice";
import Fuse from "fuse.js";
import {
  updateBackgroundImageUUID,
  updateProfileData,
  updateProfileImageUUID,
} from "@/slice/ProfileSlice";
import { useRouter } from "next/router";
import { fetchData } from "@/slice/SearchSlice";

const EditProfilePage = () => {
  const { profile } = useSelector((state: RootState) => state.profile);
  const tag = useSelector((state: RootState) => state.tags.tags);

  const fuse = new Fuse(tag, {
    includeScore: true,
  });

  const { searchbase } = useSelector((state: RootState) => state.searchbase);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    if (tag.length == 0) dispatch(fetchtags());

    if(searchbase.length ==0){
      dispatch(fetchData());
    }
  }, [dispatch, tag]);

  const [name, setName] = useState(profile.name);
  const [tags, setTags] = useState<string[]>(profile.tags);
  const [aboutMe, setAboutMe] = useState(profile.aboutMe);

  const handleTagChange = (event: React.ChangeEvent<{}>, value: string[]) => {
    // const fuzzySearch = fuse.search(value)
    console.log(value);
    setTags(value);
  };

  const handleDeleteTag = (tag: string) => {
    if (tags) {
      const updatedTags = tags.filter((t) => t !== tag);
      setTags(updatedTags);
    }
  };

  const handleProfilePicChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]; // Add null check
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      fetch(API.BASE_URL + API.UPLOAD_PROFILE_PIC, {
        method: "POST",
        headers: {
          authorization: localStorage.getItem("idToken") || "",
        },
        body: formData,
      })
        .then((response) => {
          return response.text();
        })
        .then((imageUUID: string) => {
          console.log(imageUUID);
          dispatch(updateProfileImageUUID(imageUUID)); // Dispatch the action to update the background image UUID in the Redux store
          alert("Profile Pic updated successfully")
        });
    }
  };

  const handleBackgroundImgChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]; // Add null check
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      fetch(API.BASE_URL + API.UPLOAD_PROFILE_BG, {
        method: "POST",
        headers: {
          authorization: localStorage.getItem("idToken") || "",
        },
        body: formData,
      })
        .then((response) => {
          return response.text();
        })
        .then((imageUUID: string) => {
          console.log(imageUUID);
          dispatch(updateBackgroundImageUUID(imageUUID)); // Dispatch the action to update the background image UUID in the Redux store
          alert("Background Pic updated successfully");
        });
    }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if(tags.length < 3) {
      alert("Please select atleast three tags");
      return;
    }

    try {
      const response = fetch(API.BASE_URL + API.EDIT_PROFILE.route, {
        method: API.EDIT_PROFILE.method,
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("idToken") || "",
        },
        body: JSON.stringify({
          name,
          aboutMe,
          tags,
        }),
      })
        .then((response) => response.json())
        .then((updatedData) => dispatch(updateProfileData(updatedData)))
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
    router.push('/profilePage')
  };

  return (
    <div
      style={{
        color: "#ffffff",
        marginTop: "1rem",
        marginBottom: "2rem",
        marginLeft: "6rem",
        width: "70%",
        height:"73vh",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        padding: "5rem",
      }}
    >
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <InputLabel sx={{ marginBottom: "1rem", }}>
              Profile Picture
            </InputLabel>

            <input
              type="file"
              id="upload-button"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={{
                border: "2px dashed #aaa",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: "#f5f5f5",
                color: "#555",
                fontSize: "15px",
                fontFamily: "Arial, sans-serif",
                outline: "none",
                cursor: "pointer",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel sx={{ marginBottom: "1rem", marginTop: "0.5rem" }}>
              Background Image
            </InputLabel>
            <input
              type="file"
              id="upload-button"
              accept="image/*"
              onChange={handleBackgroundImgChange}
              style={{
                border: "2px dashed #aaa",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: "#f5f5f5",
                color: "#555",
                fontSize: "15px",
                fontFamily: "Arial, sans-serif",
                outline: "none",
                cursor: "pointer",
                marginBottom: "2rem",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Name"
              value={name}
              defaultValue={profile.name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="About Me"
              value={aboutMe}
              defaultValue={profile.aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel style={{ fontSize: "1.1rem" }}>
              Let us know what you are interested in.
            </InputLabel>
            <FormControl
              fullWidth
              margin="normal"
              style={{ width: "100%", marginTop: "2rem" }}
            >
              <Autocomplete
                multiple
                value={tags}
                filterOptions={(options, state) => {
                  if (state.inputValue === "") {
                    return tag;
                  }
                  return fuse
                    .search(state.inputValue)
                    .map((result) => result.item) as string[];
                }}
                onChange={handleTagChange}
                renderInput={(params) => (
                  <TextField {...params} fullWidth label="" />
                )}
                renderTags={(value, getTagProps) => (
                  <div style={{ marginTop: "10px" }}>
                    {value.map((tag, index) => (
                      <div key={tag}>{/* <span>{tag}</span> */}</div>
                    ))}
                  </div>
                )}
                options={tag}
              />
            </FormControl>
            <Box display="flex" flexWrap="wrap" gap={0.5} marginTop={1}>
              {tags &&
                tags.map((tag: any) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    color="primary"
                    sx={{ "& .MuiChip-deleteIcon": { color: "#fff" } }}
                  />
                ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            
            <Button type="submit" variant="contained" color="primary" style={{marginTop:"1.5rem"}}>
              Save Changes
            </Button>
            
           
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default EditProfilePage;
