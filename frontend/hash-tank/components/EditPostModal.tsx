import React, { FormEvent, useRef } from "react";
import { Modal, Typography, TextField, Button } from "@mui/material";
import { API } from "@/constants/api.constants";

interface EditPostModalProps {
  onClose: () => void;
  post: any;
  postResponse:any;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  onClose,
  post,
  postResponse,
}: EditPostModalProps) => {

  console.log(`in edit modal`);
  console.log(post);
  console.log(postResponse);


  const titleRef = useRef<any>();
  const descRef = useRef<any>();

  function handlePostEdit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const title = titleRef.current.value;
    const description = descRef.current.value;
    console.log(title, description);
    
    try {
      fetch(API.BASE_URL + API.POST_EDIT.route + `/${post.id}`,{
        method: API.POST_EDIT.method,
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("idToken") || "",
        },
        body: JSON.stringify({
          title:title,
          description:description,
        }),
      })
      .then((response)=>{alert('post successfully edited')
        onClose();
    })
      .catch((error)=>{console.log(error)});
    } catch (error) {
      console.log(error);
    }
    
    
  }

  return (
    <Modal
      open
      onClose={onClose}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: '100000',
      }}
    >
      <div
        style={{
          width: "600px",
          height: "700px",
          backgroundColor: "#fdfcfc",
          outline: "none",
          overflow: "hidden",
          borderRadius: "4px",
          padding: "16px",
          zIndex: "100000",
        }}
      >
        <Typography variant="h6">Edit Post</Typography>
        <form onSubmit={handlePostEdit}>
        <TextField
          label="Title"
          inputRef={titleRef}
          defaultValue={post.title}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          inputRef={descRef}
          defaultValue={post.caption}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <Button
          variant="contained"
          type="submit"
          fullWidth
          color="primary"
          style={{ marginTop: 16 }}
        >
          Edit
        </Button>
        </form>
      </div>
    </Modal>
  );
};

export default EditPostModal;
