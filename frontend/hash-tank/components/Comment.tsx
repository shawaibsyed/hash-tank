import { API } from "@/constants/api.constants";
import { RootState } from "@/store";
import { Avatar, Modal, Typography, TextField, Button } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import styles from "../styles/comment.module.css";

interface CommentProps {
  post: any;
  comment: any;
  onClose: () => void;
}

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

export default function Comment({ post, comment, onClose }: CommentProps) {
  const { profile } = useSelector((state: RootState) => state.profile);
  const [newComment, setNewComment] = useState("");
  const [showComment, setShowComment] = useState<any[]>([]);

  useEffect(() => {
    setShowComment(
      comment.map((c: any) => ({
        ...c,
        role: c.role,
        sentiment: c.sentiment,
        createdAt: c.createdAt,
      }))
    );
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

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value);
  };

  return (
    <Modal
      open
      onClose={onClose}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className={styles.container}>
        <Typography variant="h6" className={styles.title}>
          Comments
        </Typography>

        {showComment.length === 0 ? (
          <Typography variant="body1">No comments</Typography>
        ) : (
          <div className={styles.commentContainer}>
            {showComment.map((comment: any, index: number) => (
              <div key={index} className={styles.commentItem}>
                <Avatar
                  src={comment.profilePic}
                  alt={comment.name}
                  style={{
                    ...getRandomColor(comment.name),
                    marginRight: "8px",
                    padding: "2px",
                    border:
                      comment.role === "titan"
                        ? "2px solid red"
                        : "2px solid green",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {comment.name ? comment.name.charAt(0) : ""}
                </Avatar>
                <div className={styles.commentText}>
                  <Typography
                    variant="subtitle1"
                    style={{ marginBottom: "4px" }}
                  >
                    {comment.name}
                  </Typography>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body1">
                      {comment.userComment}
                    </Typography>
                  </div>
                  <Typography variant="caption" color="textSecondary">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </Typography>
                </div>
                <span className={styles.sentiment}>
                  {comment.sentiment === "positive"
                    ? "😄"
                    : comment.sentiment === "negative"
                    ? "😔"
                    : "😐"}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.addCommentContainer}>
          <TextField
            label="Add a comment"
            variant="outlined"
            value={newComment}
            onChange={handleCommentChange}
            fullWidth
            multiline
            rows={3}
            className={styles.addCommentTextField}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCommentSubmit}
            className={styles.submitButton}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
