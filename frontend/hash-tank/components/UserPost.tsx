import {
  Button,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Key, useEffect, useState } from "react";
import PostModal from "./PostModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";
import { API } from "@/constants/api.constants";
import Image from "next/image";
import { Edit, AddRounded } from "@mui/icons-material";
import { privateDecrypt } from "crypto";
import VideoCard from "./VideoCard";

function UserPost(props: any) {
  // const { profile } = useSelector((state: RootState) => state.profile);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>("all");
  const [postData, setPostData] = useState<any[]>([]);
  // const [likesCount, setLikesCount] = useState(0);
  // const [comment, setComment] = useState<any>();
  const profile = props.profile;
  const posts = props.profile.posts;
  console.log(profile.products);
  console.log(props.profile);

  useEffect(() => {
    if (props.prodName) {
      setSelectedProduct(props.prodName);
    }
    const fetchData = async () => {
      try {
        const promises = posts.map(async (post: any) => {
          const postResponse = await fetch(
            API.BASE_URL + API.GET_POST.route + `/${post}`,
            {
              method: API.GET_POST.method,
              headers: {
                authorization: localStorage.getItem("idToken") || "",
              },
            }
          );
          const postData = await postResponse.json();

          const commentsResponse = await fetch(
            API.BASE_URL + API.GET_POST_COMMENTS.route + `/${post}`,
            {
              method: API.GET_POST_COMMENTS.method,
              headers: {
                authorization: localStorage.getItem("idToken") || "",
              },
            }
          );
          const commentsData = await commentsResponse.json();

          // Combine all the data into a single object
          return {
            id: post,
            post: postData,
            // likesCount: likesCountData.count,
            comments: commentsData,
            page: 2,
          };
        });

        const results = await Promise.all(promises);
        setPostData(results);
      } catch (error) {
        console.log("Error fetching posts:", error);
      }
    };

    fetchData();
  }, [posts]);
  console.log(postData);

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleProductChange = (event: SelectChangeEvent<string | null>) => {
    setSelectedProduct(event.target.value);
  };

  return (
    <>
      <Grid item xs={12} mt={5}>
        {/* Product Controls */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {/* Select Field */}
            <InputLabel>Select a Product</InputLabel>
            <Select
              value={selectedProduct}
              onChange={handleProductChange}
              fullWidth
            >
              <MenuItem value={"all"}>All Products</MenuItem>
              {profile &&
                profile.products &&
                profile.products.length > 0 &&
                profile.products.map((product: string) => (
                  <MenuItem key={product} value={product}>
                    {product}
                  </MenuItem>
                ))}
            </Select>
          </Grid>
          {props.privateProfile && (
            <Grid item xs={6} sx={{ display: "flex", marginTop: "1.5rem" }}>
              {/* Create Product Button */}
              <Link href="/createProduct">
                <IconButton
                  sx={{
                    flexGrow: 1,
                    color: "var(--button-color)",
                    fontSize: "3rem",
                  }}
                >
                  <AddRounded sx={{ fontSize: 32 }} />
                </IconButton>
              </Link>

              {/* Update Product Button */}
              <Link href="/updateProduct">
                <IconButton
                  sx={{ marginLeft: 2, color: "var(--button-color)" }}
                >
                  <Edit sx={{ fontSize: 32 }} />
                </IconButton>
              </Link>
            </Grid>
          )}
        </Grid>
      </Grid>

      <Grid item xs={12} mt={5}>
        {/* Posts */}
        <div style={{ height: "50rem", overflow: "auto" }}>
          <Grid container spacing={2}>
            {postData.length > 0 ? (
              postData
                .filter(
                  (post: any) =>
                    selectedProduct == "all" ||
                    post.post.prodName == selectedProduct
                )
                .map((post: any) => (
                  <Grid item xs={4} key={post.id}>
                    <Paper
                      elevation={3}
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        minHeight: "200px",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                      onClick={() => handlePostClick(post)}
                    >
                      {post && (
                        <Image
                          src={`${API.BASE_URL}${API.THUMBNAIL.route}/${post.post.content}`}
                          alt="Post Image"
                          layout="fill"
                          objectFit="cover"
                        />
                      )}
                    </Paper>
                  </Grid>
                ))
            ) : (
              <Grid item xs={12}>
                <Paper
                  elevation={3}
                  style={{
                    padding: "10px",
                    minHeight: "200px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    outline: "none",
                    boxShadow: "none"
                  }}
                >
                  <span>No posts</span>
                </Paper>
              </Grid>
            )}
          </Grid>
        </div>
      </Grid>
      {selectedPost && (
        <Modal open={true} onClose={handleCloseModal} sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "100px",
          left: "9%",
          width: "80%",
          height: "82%",
          zIndex: 9999,
        }}>
          <VideoCard post={selectedPost} onClose={handleCloseModal} privateProfile={props.privateProfile} />
        </Modal>
      )}
      {/* {selectedPost && (
        <Modal open={true} onClose={handleCloseModal}>
          <PostModal post={selectedPost} onClose={handleCloseModal} privateProfile={props.privateProfile} />
        </Modal>
      )} */}
    </>
  );
}

export default UserPost;
