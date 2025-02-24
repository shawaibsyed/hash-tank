import { FormEvent, useRef, useState } from "react";
import {
  Container,
  Button,
  FormControl,
  InputLabel,
  TextField,
  Alert,
  Box,
  Chip,
  Link,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { API } from "@/constants/api.constants";
import { User, deleteUser } from "@firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Fuse from "fuse.js";

function FollowUpPage({ userData }: any) {
  const [docID, setDocID] = useState<any>("");
  const router = useRouter();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const tag = useSelector((state: RootState) => state.tags.tags);
  const fuse = new Fuse(tag, {
    includeScore: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [docFile, setDocFile] = useState<any>();
  const [tags, setTags] = useState<string[]>([]);

  const handleTagChange = (event: React.ChangeEvent<{}>, value: string[]) => {
    setTags(value);
  };

  const handleDeleteTag = (tag: string) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setDocFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (userData.role=='titan' &&  !docFile) {
        setError("Please select a file");
        return;
      }
      if(tags.length < 3){
        setError("Please select atleast three tags");
        return;
      }
      const value =signup(userData.email, userData.password).then(async (user: User) => {

        if (typeof user === 'string') {
          // Error occurred during signup
          if (user === 'The email address is already in use. Please choose a different email.') {
            setError(user);
          } else if (user === 'The email address is already in use. Please choose a different email.') {
            setError(user);
          } else if (user === 'The email address is invalid') {
            setError(user);
          } else {
            setError('Failed to sign up.');
          }
          return;
        }

        fetch(API.BASE_URL + API.CREATE_PROFILE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.uid,
            name: userData.name,
            username: userData.name,
            email: userData.email,
            role: userData.role,
            verificationDocument: docID,
            tags: tags,
          }),
        }).catch((err) => {
          deleteUser(user);
        });
        alert("Verify the email sent to your mail");
        router.push("/login");
      });
    } catch (error:any) {
        setError('Failed to sign up.');
    }
  };

  function handleUploadButtonClick(event: any): void {
    if (!docFile) {
      setError("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("document", docFile);
    fetch(API.BASE_URL + API.DOCUMENT_UPLOAD, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        return response.text();
      })
      .then((data: any) => {
        setDocID(data);
      });
  }

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#2A385B",
        height: "100vh",
        backgroundImage: "url(images/loginscreen.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: "10%",
          padding: "1rem",
          borderRadius: "4px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "6rem",
            borderRadius: "4px",
            width: "40rem",
            maxWidth: "90vw",
          }}
        >

{error && <Alert severity="error">{error}</Alert>}

            <InputLabel style={{ fontSize: "1.1rem"}}>Let us know what you are interested in..</InputLabel>
            <FormControl fullWidth margin="normal" style={{ width: "100%", marginTop: "2rem" }}>
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
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  color="primary"
                  sx={{ "& .MuiChip-deleteIcon": { color: "#fff" } }}
                />
              ))}
            </Box>

          <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: "2rem" }}>
          
            {userData!.role == "titan" && (
              <div>
                <InputLabel style={{ fontSize: "1.1rem", marginBottom:"0.5rem", display: "block" }}>Document Verification: Please upload the following documents in a single pdf</InputLabel>
                <InputLabel style={{marginBottom:"1rem", display: "block" }}>Accreditation Documentation, PanCard, AadharCard</InputLabel>
  
                  <Link href="https://www.adobe.com/uk/acrobat/online/merge-pdf.html#:~:text=Follow%20these%20easy%20steps%20to%20combine%20PDF%20documents,to%20organise%20individual%20pages%20or%20share%20the%20file.">
                    <InputLabel style={{marginBottom:"1rem", color: "#116ECB", display: "block" }}>Merge the documents into a pdf</InputLabel>
                  </Link>
                <FormControl fullWidth margin="normal" style={{ width: "100%" }}>
                <input
                  type="file"
                  id="upload-button"
                  accept=".pdf"
                  onChange={handleFileChange}
                  style={{
                    border: "2px dashed #aaa",
                    padding: "10px",
                    borderRadius: "4px",
                    backgroundColor: "#f5f5f5",
                    color: "#555",
                    fontSize: "16px",
                    fontFamily: "Arial, sans-serif",
                    outline: "none",
                    cursor: "pointer",
                  }}
                  ref={fileInputRef}
                />
                <Button
                  variant="contained"
                  component="span"
                  onClick={handleUploadButtonClick}
                  style={{marginTop:"2rem"}}
                >
                  Upload PDF
                </Button>
              </FormControl>
              </div>
            )}
            <Button variant="contained" type="submit" style={{marginTop:"2rem", width:"100%"}}>
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FollowUpPage;
