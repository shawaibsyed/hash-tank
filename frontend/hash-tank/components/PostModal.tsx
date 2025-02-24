import { IconButton, Menu, MenuItem, Modal, Typography } from "@mui/material";
import { ShareFat } from "@phosphor-icons/react";
import {
  ArrowsIn,
  ArrowsOut,
  ChatCircle,
  DotsThreeOutlineVertical,
  Heart,
  X,
} from "phosphor-react";
import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import VideoPlayer from "./VideoModal";
import EditPostModal from "./EditPostModal";
import { API } from "@/constants/api.constants";
import { deletePitch } from "@/slice/ProfileSlice";
import { useDispatch } from "react-redux";

interface PostModalProps {
  post: any;
  onClose: () => void;
  privateProfile: boolean;
}

export default function PostModal({ post, onClose, privateProfile }: PostModalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [postResponse, setPostResponse] = useState<any>();
  const [likesCount, setLikesCount] = useState(0);
  const dispatch = useDispatch();
  // console.log("this is selected post  " + post.likesCount);
  const id = post.id;

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
    setLikesCount((prevCount: number) => (isLiked ? prevCount - 1 : prevCount + 1));
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

  const handleCommentClick = () => {
    setIsCommentModalOpen(true);
  };

  const handleCloseCommentModal = () => {
    setIsCommentModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
    handleClose();
  };

  const handleDelete = async () => {
    try {
      dispatch(deletePitch(id));
      onClose();
      const response = await fetch(
        API.BASE_URL + API.POST_DELETE.route + `/${id}`,
        {
          method: API.POST_DELETE.method,
          headers: {
            authorization: localStorage.getItem("idToken") || "",
          },
        }
        )
        .catch((error) => {console.log(error);})
        
        // const responseData =   response.json();
        // console.log(response);
        // console.log(responseData);
        
         // Close the modal after deleting the pitch
      alert("Pitch deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditPost = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Modal open={isCommentModalOpen} onClose={handleCloseCommentModal}>
        <Comment post={post} comment={post.comments} onClose={handleCloseCommentModal} />
      </Modal>

      {isEditModalOpen && (
        <Modal open={isEditModalOpen} onClose={handleCloseEditModal}>
          <EditPostModal
            post={post}
            onClose={handleCloseEditModal}
            postResponse={postResponse}
          />
        </Modal>
      )}

      <Modal
        open
        onClose={onClose}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: isFullScreen ? "100vw" : "600px",
            height: isFullScreen ? "100vh" : "700px",
            backgroundColor: isCommentModalOpen ? "#f1f1f1" : "#dcdcdc",
            outline: "none",
            borderRadius: "4px",
            overflow: "hidden",
            position: "relative",
            border: "2px solid #bdbdbd",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid #bdbdbd",
              backgroundColor: isCommentModalOpen ? "#f1f1f1" : "#dcdcdc",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="subtitle1" sx={{ color: "#333333" }}>
              Profile Name
            </Typography>
            {
              privateProfile && (
                <IconButton onClick={handleEditPost}>
              <DotsThreeOutlineVertical
                size={32}
                color="#ffffff"
                weight="fill"
              />
            </IconButton>
            
              )
            }
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleEdit}>Edit Post</MenuItem>
              <MenuItem onClick={handleDelete}>Delete Post</MenuItem>
            </Menu>
          </div>

          {/* Render post image */}
          <div
            style={{
              height: isFullScreen ? "90vw" : "300px",
              background: "#ffffff",
            }}
          >
            <VideoPlayer content={post.post.content} page={post.page}/>
          </div>

          <div
            style={{
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: isCommentModalOpen ? "#f1f1f1" : "#dcdcdc",
            }}
          >
            {/* Implement like, comment, and share functionality */}
            <div>
              <IconButton onClick={handleLikeClick}>
                <Heart
                  size={32}
                  color={isLiked ? "#ff0000" : "#fdfcfc"}
                  weight={isLiked ? "fill" : "regular"}
                />
              </IconButton>
              <IconButton onClick={handleCommentClick}>
                <ChatCircle size={32} color="#fdfcfc" />
              </IconButton>
              <IconButton>
                <ShareFat size={32} color="#fdfcfc" />
              </IconButton>
            </div>
          </div>

          {/* Render post title and caption */}
          <div
            style={{
              padding: "16px",
              backgroundColor: isCommentModalOpen ? "#f1f1f1" : "#dcdcdc",
              color: "#333333",
            }}
          >
            <Typography variant="h6">{likesCount} Likes</Typography>
            <Typography variant="h6">
              {post && post.post.title}
            </Typography>
            <Typography variant="body1">
              {post && post.post.description}
            </Typography>
          </div>
        </div>
      </Modal>
    </>
  );
}