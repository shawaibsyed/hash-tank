import { useRef, useState } from "react";
import { Button, TextField, Typography, Alert } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const ForgotPassword = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const { resetpassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

   function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    console.log("Submit");

    try {
      setMessage("");
      setError("");
      console.log(emailRef.current!.value);
      resetpassword(emailRef.current!.value);
      setMessage("Check your inbox for further instructions");
    } catch (error){
      console.log(error);
      setError("Failed to reset password");
    }
  }

  return (
    <>
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
              top: "25%",
              padding: "2rem",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "5rem",
                borderRadius: "4px",
                width: "31rem",
                maxWidth: "90vw",
              }}
            >
          <Typography variant="h4" align="center" mb={4} sx={{ fontSize: '2rem' }}>
            Password Reset
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {message && <Alert severity="success">{message}</Alert>}
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              label="Email"
              type="email"
              inputRef={emailRef}
              required
              fullWidth
              margin="normal"
            />
            <Button
              // disabled={loading}
              variant="contained"
              fullWidth
              type="submit"
              style={{ marginTop: 16 }}
            >
              Reset Password
            </Button>
          </form>
          <div className="w-100 text-center mt-3" style={{ marginTop: 16 }}>
            <Link
              href="/login"
            >
              Login
            </Link>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default ForgotPassword;
