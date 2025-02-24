import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  LinearProgress,
  LinearProgressProps,
} from "@mui/material";
import { API } from "@/constants/api.constants";
import { updatePitch, updateProfileData } from "@/slice/ProfileSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { fetchData } from "@/slice/SearchSlice";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const UploadPitchPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [videoId, setVideoId] = useState<any>();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { profile } = useSelector((state: RootState) => state.profile);
  const products = profile.products;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // useEffect(() => {
  //   if (uploadProgress === 100) {
  //     alert("Video Uploaded Successfully");
  //   }
  // }, [uploadProgress]);

  const { searchbase } = useSelector((state: RootState) => state.searchbase);

  useEffect(() => {
    if(searchbase.length ==0){
      dispatch(fetchData());
    }
  },[])

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleVideoFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    setVideoFile(file);
  };

  const handleProductChange = (event: SelectChangeEvent<string>) => {
    setSelectedProduct(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission here
    if(!videoId){
      alert("Please wait your video is uploading");
      return;
    }

    fetch(API.BASE_URL + API.CREATE_POST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("idToken") || "",
      },
      body: JSON.stringify({
        title: title,
        description: description,
        prodName: selectedProduct,
        content: videoId,
      }),
    })
      .then((response) => response.json())
      .then((newPitch) => {
        dispatch(updatePitch(newPitch.postId));
        router.push("/profilePage");
      })
      .catch((err) => {
        alert('Error while uploading pitch');
      });

      router.push("/profilePage");
  };

  async function handleUpload() {
    try {
      const formData = new FormData();
      if (videoFile) {
        formData.append("video", videoFile);
        try {
          axios
            .post(API.BASE_URL + "/video/upload", formData, {
              headers: {
                "Content-Type": 'multipart/form-data',
                authorization: localStorage.getItem("idToken") || "",
              },
              onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / (progressEvent.total || 1)
                );
                setUploadProgress(progress);
              },
            })
            .then(({ data }) => {
              setVideoId(data.uniqueId);
            });
        } catch (e) {
          alert("Error while uploading video");
        }
      }
    } catch (error) {
    }
    return "upload";
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      bottom="20%"
      padding="10rem"
      height="55%"
      width="75%"
      style={{
        color: "#ffffff",
        marginTop: "2rem",
        marginBottom: "6rem",
        marginLeft: "5rem",
        boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px",
      }}
    >
      <Box width="100%">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          style={{
            paddingBottom: "2rem",
            fontFamily: "'Abril Fatface', cursive",
          }}
        >
          <span className="gradient-text">Upload Pitch</span>
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            value={title}
            onChange={handleTitleChange}
            fullWidth
            required
            margin="normal"
            style={{ background: "#fff" }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={handleDescriptionChange}
            fullWidth
            required
            multiline
            rows={4}
            margin="normal"
            style={{ background: "#fff" }}
          />
          <FormControl
            fullWidth
            required
            margin="normal"
            style={{ background: "#fff" }}
          >
            <InputLabel htmlFor="product-select">Select a Product</InputLabel>
            <Select
              value={selectedProduct}
              label="Select a Product"
              onChange={handleProductChange}
              inputProps={{ id: "product-select" }}
              sx={{ width: "90%" }}
            >
              {products &&
                products.length > 0 &&
                products.map((product: any) => (
                  <MenuItem key={product} value={product}>
                    {product}
                  </MenuItem>
                ))}
            </Select>
            <Link href="/createProduct">
              <AddRoundedIcon
                color="primary"
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: "1.8rem",
                  transform: "translateY(-50%)",
                  fontSize: "2rem",
                }}
              />
            </Link>
          </FormControl>

          <Button
            variant="contained"
            component="label"
            style={{ margin: "12px" }}
          >
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoFileChange}
            />
          </Button>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <LinearProgressWithLabel value={uploadProgress} />
          )}

          <br />

          <Button
            component="label"
            variant="contained"
            style={{ margin: "10px" }}
            onClick={handleUpload}
          >
            Upload File
          </Button>

          <br />
          {(uploadProgress < 100  && videoId!='undefined') ? (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled
              style={{ marginTop: "40px", backgroundColor: "gray", color: "white" }}
            >
              Submit
            </Button>
          ) : (
            <Button
              style={{ marginTop: "40px" }}
              type="submit"
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          )}
        </form>
      </Box>
    </Box>
  );
};

export default UploadPitchPage;
