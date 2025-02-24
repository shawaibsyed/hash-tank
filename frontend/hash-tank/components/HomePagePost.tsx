import { useEffect, useState } from "react";
import { API } from "@/constants/api.constants";
import { Avatar, Grid, IconButton, Paper, Typography } from "@mui/material";
import Image from "next/image";
import VideoPlayer from "./VideoModal";
import { ChatCircle, Heart } from "phosphor-react";
import { ShareFat } from "@phosphor-icons/react";
import CommentHomePage from "./CommentInHomePage";

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

function HomePagePost({ post, onClick }: any) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comment, setComment] = useState<any>();

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

  return (
    <Paper
      elevation={3}
      style={{
        padding: "10px",
        border: "1px solid #ccc",
        height: "75vh",
        width: "166%",
        margin: "1.5rem",
      }}
      onClick={() => onClick(post)}
    >
      {post && (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ margin: "10px" }}>
                <Avatar
                  src={post.profilePic}
                  alt={post.name}
                  style={{
                    ...getRandomColor(post.post.username),
                    marginRight: "8px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {post.post.name ? post.post.name.charAt(0) : post.post.username.charAt(0)}
                </Avatar>
              </div>
              <div>
                <Typography
                  style={{
                    fontSize: "var(--fs-sub-heading)",
                    marginTop: "10px",
                  }}
                >
                  {post.post.username}
                </Typography>
              </div>
            </div>
            <div style={{ backgroundColor: "black" }}>
              <VideoPlayer content={post.post.content} page={post.page} />
            </div>
            <div>
              <IconButton onClick={handleLikeClick}>
                <Heart
                  size={32}
                  color={isLiked ? "#ff0000" : "#000000"}
                  weight={isLiked ? "fill" : "regular"}
                />
              </IconButton>
              {/* <IconButton>
                <ChatCircle size={32} color="#000" />
              </IconButton> */}
              <IconButton>
                <ShareFat size={32} color="#000" />
              </IconButton>
            </div>
          </div>

          <div style={{ marginLeft: "15px" }}>
            <Typography
              style={{
                fontSize: "var(--fs-sub-heading)",
              }}
            >
              {post.post.title}
            </Typography>
            <Typography
              style={{
                fontSize: "var(--fs-normal)",
                maxHeight:'100px',
                overflowY: 'auto',
              }}
            >
              {post.post.description}
            </Typography>
            <CommentHomePage post={post} comment={comment} />
          </div>
        </div>
      )}
    </Paper>
  );
}

export default HomePagePost;
