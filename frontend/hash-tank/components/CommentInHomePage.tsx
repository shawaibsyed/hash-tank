import { API } from "@/constants/api.constants";
import { RootState } from "@/store";
import { Avatar, Modal, Typography, TextField, Button } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import styles from "../styles/comment.module.css";
import { SealCheck } from "@phosphor-icons/react";

interface CommentProps {
  post: any;
  comment: any;
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

export default function CommentHomePage({ post, comment }: CommentProps) {
  const { profile } = useSelector((state: RootState) => state.profile);
  const [newComment, setNewComment] = useState("");
  const [commentLength, setCommentLength] = useState(0);
  
  useEffect(()=>{
    if(comment)
      setCommentLength(comment.length);
  },[comment]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width:"580px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "40vh",
          backgroundColor: "#fff",
          outline: "none",
          borderRadius: "4px",
          overflow: "auto", 
          position: "relative",
          padding: "20px",
        }}
      >
         <style jsx>{`
          ::-webkit-scrollbar {
            width: 3px; /* Set the width of the scrollbar */
          }

          ::-webkit-scrollbar-thumb {
            background-color: #888; /* Set the color of the scrollbar thumb */
          }
        `}</style>
        {/* <Typography variant="h6">Comments</Typography> */}
        <Typography variant="h6" sx={{ marginTop: "1rem", marginBottom:"2rem" }}>{commentLength} Comments</Typography>


        {comment && comment.length > 0 ? (
          <div className={styles.commentContainer}>
            {comment.map((comment: any, index: number) => (
              <div key={index} className={styles.commentItem}>
                <Avatar
                  // src={comment.profilePic}
                  src={`${API.BASE_URL}${API.GET_PROFILE_PIC.route}/${comment.profilePic}`}
                  alt={comment.name}
                  className={`${styles.avatar} ${comment.role === "titan" ? styles.titan : styles.others}`}
                  
                />
                <div className={styles.commentText}>
                  <Typography variant="subtitle1" style={{ marginBottom: "4px" }}>
                    {comment.name}
                    {comment.role === "titan" && (
                        <SealCheck size={16} color="#00a3f5" weight="fill" />
                      )}
                  </Typography>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body1">{comment.userComment}</Typography>
                  </div>
                  <Typography variant="caption" color="textSecondary">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </Typography>
                </div>
                <span className={styles.sentiment}>
                  {comment.sentiment === "positive" ? "😄" : comment.sentiment === "negative" ? "😔" : "😐"}
                </span>
              </div>
            ))}
          </div>
        ) 
        : (
          <Typography variant="body1">No comments</Typography>
        )}
      </div>
    </div>
  );
}