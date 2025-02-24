import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
// import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { API } from "@/constants/api.constants";
import VideoPlayer from "./VideoModal";
import CommentHomePage from "./CommentInHomePage";
// import styles from "../styles/comment.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import SendIcon from "@mui/icons-material/Send";
import { DotsThreeOutlineVertical } from "phosphor-react";
import { deletePitch } from "@/slice/ProfileSlice";
import PaidIcon from "@mui/icons-material/Paid";
import EditPostModal from "./EditPostModal";
import SendMail from "./SendMail";
import { Telegram } from "@mui/icons-material";
import Link from "next/link";

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

const VideoCard = ({ post, onClose }: any) => {
  const [comment, setComment] = useState<any>();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [postResponse, setPostResponse] = useState<any>();
  const [likesCount, setLikesCount] = useState(0);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const { profile } = useSelector((state: RootState) => state.profile);
  const [openMail, setOpenMail] = useState(false);

  const handleOpenMail = () => {
    setOpenMail(true);
  };

  const handleCloseMail = () => {
    setOpenMail(false);
  };

  const id = post.id;
  console.log(post);

  useEffect(() => {
    const fetchLikesCount = async () => {
      try {
        const response = await fetch(
          API.BASE_URL + API.GET_POST_LIKES_COUNT.route + `${id}/likesCount`,
          {
            method: API.GET_POST_LIKES_COUNT.method,
            headers: {
              authorization: localStorage.getItem("idToken") || "",
            },
          }
        );
        const responseData = await response.json();
        console.log(responseData);
        setLikesCount(responseData.count);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(
          API.BASE_URL + API.CHECK_POST_LIKE.route + `/${id}`,
          {
            method: API.CHECK_POST_LIKE.method,
            headers: {
              authorization: localStorage.getItem("idToken") || "",
            },
          }
        );
        const responseData = await response.json();

        setIsLiked(responseData.isLiked);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLikeStatus();
    fetchLikesCount();
  }, [post.id]);

  const handleLikeClick = () => {
    console.log(likesCount);
    setIsLiked((prev) => !prev);
    setLikesCount((prevCount: number) =>
      isLiked ? prevCount - 1 : prevCount + 1
    );
    const fetchPostLike = async () => {
      try {
        const response = await fetch(
          API.BASE_URL + API.LIKE_POST.route + `${id}/likeUnlike`,
          {
            method: API.LIKE_POST.method,
            headers: {
              authorization: localStorage.getItem("idToken") || "",
            },
          }
        );
        const responseData = await response.json();
        console.log(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPostLike();
  };

  const [newComment, setNewComment] = useState("");

  const [showComment, setShowComment] = useState<any>();

  useEffect(() => {
    const fetchCommentData = async () => {
      try {
        const commentsResponse = await fetch(
          API.BASE_URL + API.GET_POST_COMMENTS.route + `/${post.id}`,
          {
            method: API.GET_POST_COMMENTS.method,
            headers: {
              authorization: localStorage.getItem("idToken") || "",
            },
          }
        );
        const comment = await commentsResponse.json();
        console.log(comment);
        setShowComment(
          comment.map((c: any) => ({
            ...c,
            role: c.role,
            sentiment: c.sentiment,
            createdAt: c.createdAt,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchCommentData();
  }, [comment]);

  const handleCommentSubmit = async () => {
    const response = await fetch(API.BASE_URL + API.POST_COMMENT.route, {
      method: API.POST_COMMENT.method,
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("idToken") || "",
      },
      body: JSON.stringify({
        postId: post.id,
        commentContent: [
          {
            userComment: newComment,
            role: profile.role,
            sentiment: profile.sentiment,
          },
        ],
      }),
    })
      .then((response) => {
        setNewComment("");
      })
      .catch((error) => console.log(error));

    setShowComment([
      ...showComment,
      {
        name: profile.username,
        userComment: newComment,
        profilePic: profile.profilePic,
        role: profile.role,
        sentiment: profile.sentiment,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
    handleClose();
  };

  const handleDelete = async () => {
    dispatch(deletePitch(id));
    onClose();
    try {
      const response = await fetch(
        API.BASE_URL + API.POST_DELETE.route + `/${id}`,
        {
          method: API.POST_DELETE.method,
          headers: {
            authorization: localStorage.getItem("idToken") || "",
          },
        }
      );
      // const responseData = response.json();

      setIsEditModalOpen(false);
      handleCloseEditModal(); // Close the modal after deleting the pitch
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditPost = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Card
        sx={{
          overflowY: "auto",
          height: "51.5rem",
          width: "100%",
          margin: "0.5rem",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          marginLeft: "2rem",
          "&::-webkit-scrollbar": {
            width: "0.4em",
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "transparent",
          },
        }}
      >
        <CardContent>
          <Grid container direction="column">
            {/* Header */}
            <Grid item>
              <Grid container justifyContent="space-between">
                <Grid item sx={{ display: "flex", alignItems: "center" }}>
                  {/* <Avatar
                    src={post.profilePic}
                    alt={post.post.username}
                    style={{ marginRight: "8px" }}
                  /> */}
                  <Avatar
                    src={`${API.BASE_URL}${API.GET_PROFILE_PIC.route}/${post.post.profilePic}`}
                    alt={post.post.username}
                    style={{
                      ...getRandomColor(post.post.userId),
                      // fontSize: "18px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {post.post.username ? post.post.username.charAt(0) : "A"}
                  </Avatar>
                  <Link
                    href={`/profilePage/${post.post.userId}/product/all`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ marginLeft: "1rem", marginTop: "-0.4rem" }}
                    >
                      {post.post.username}
                    </Typography>
                  </Link>
                </Grid>

                {isEditModalOpen && (
                  <Modal open={isEditModalOpen} onClose={handleCloseEditModal}>
                    <EditPostModal
                      post={post}
                      onClose={handleCloseEditModal}
                      postResponse={postResponse}
                    />
                  </Modal>
                )}

                {post.post.userId == profile.userId && (
                  <IconButton
                    onClick={handleEditPost}
                    // sx={{ marginTop: "-0.4rem" }}
                  >
                    <DotsThreeOutlineVertical
                      size={31}
                      color="grey"
                      weight="fill"
                    />
                  </IconButton>
                )}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  style={{ zIndex: 9999 }}
                >
                  <MenuItem onClick={handleEdit}>Edit Post</MenuItem>
                  <MenuItem onClick={handleDelete}>Delete Post</MenuItem>
                </Menu>
              </Grid>
            </Grid>

            <Divider sx={{ marginTop: "0.7rem", marginBottom: "0.3rem" }} />

            {/* Middle Content */}
            <Grid item xs>
              <Grid container spacing={0.2}>
                <Grid
                  item
                  sx={{ height: "800", width: "600", backgroundColor: "black" }}
                >
                  {/* Video */}
                  <VideoPlayer content={post.post.content} page={post.page} />
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{ marginTop: "2rem", marginLeft: "4rem" }}
                >
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {post.post.title}
                  </Typography>
                  <Typography variant="h5" sx={{ marginTop: "0.7rem" }}>
                    {post.post.prodName}
                  </Typography>
                  <div
                    style={{
                      overflowY: "auto",
                      maxHeight: "8rem",
                      width: "110%",
                      color: "grey",
                    }}
                  >
                    <style jsx>{`
                      ::-webkit-scrollbar {
                        display: none; /* Hide the scrollbar */
                      }
                    `}</style>
                    <Typography
                      variant="h6"
                      sx={{
                        marginTop: "0.5rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {post.post.description}
                    </Typography>
                  </div>

                  <div style={{ marginTop: "1rem", marginLeft: "-2rem" }}>
                    <CommentHomePage post={post} comment={showComment} />
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Divider sx={{ marginTop: "0.3rem" }} />

            {/* Footer */}
            <Grid item sx={{ alignItems: "center", height: "4vh" }}>
              <Grid container justifyContent="space-between">
                <Grid item xs={6}>
                  <div>
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        position: "relative",
                        top: "0.6rem",
                        fontSize: "1.8rem",
                        color: "black",
                        fontFamily: "Roboto",
                      }}
                    >
                      {likesCount}
                    </span>
                    <IconButton
                      sx={{ color: "#000" }}
                      onClick={handleLikeClick}
                    >
                      {isLiked ? (
                        <FavoriteIcon
                          sx={{
                            fontSize: "2rem",
                            color: "#ff0000",
                            marginTop: "0.5rem",
                          }}
                        />
                      ) : (
                        <FavoriteBorderIcon
                          sx={{
                            fontSize: "2rem",
                            color: "grey",
                            marginTop: "0.5rem",
                          }}
                        />
                      )}
                    </IconButton>
                    <Modal open={openMail} onClose={handleCloseMail}>
                      <SendMail body={post.post.description} />
                    </Modal>

                    <IconButton onClick={handleOpenMail}>
                      <Telegram
                        onClick={handleOpenMail}
                        sx={{
                          color: "#00aeff",
                          fontSize: 32,
                          marginRight: "0.5rem",
                          cursor: "pointer",
                          marginTop: "0.5rem",
                        }}
                      />
                    </IconButton>
                    {/* {post.post.userId != profile.userId && (
                    <IconButton>
                      <PaidIcon
                        sx={{
                          fontSize: "2rem",
                          color: "grey",
                          marginTop: "1rem",
                        }}
                      />
                    </IconButton>
                  )} */}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ marginLeft: "8rem", boxShadow: "none" }}>
                    <InputBase
                      sx={{ ml: 1, flex: 1, padding: "1rem", width: "90%" }}
                      placeholder="Add a comment"
                      value={newComment}
                      onChange={handleCommentChange}
                    />
                    <IconButton onClick={handleCommentSubmit}>
                      <SendIcon />
                    </IconButton>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default VideoCard;
