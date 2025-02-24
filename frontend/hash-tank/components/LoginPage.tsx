import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Button, TextField, Typography, Alert, Modal } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { API } from "@/constants/api.constants";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchtags } from "@/slice/TagsSlice";
import { fetchData } from "@/slice/SearchSlice";

const LoginPage = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<any>(null);

  const { login, verificationLink } = useAuth();

  const tagsRef = useRef(false);
  const { tags } = useSelector((state: RootState) => state.tags);
  const { searchbase } = useSelector((state: RootState) => state.searchbase);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (tagsRef.current === false && tags.length === 0) dispatch(fetchtags());
    tagsRef.current = true;

    if (searchbase.length == 0) {
      dispatch(fetchData());
    }
  }, [dispatch, tags]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const value = await login(
        emailRef.current!.value,
        passwordRef.current!.value
      );
      if (value.user.emailVerified === false) {
        verificationLink(emailRef.current!.value);
        alert("Verify Your Email");
      } else {
        const isVerified = await fetch(API.BASE_URL + API.PROFILE_VERIFIED, {
          method: "GET",
          headers: {
            authorization: localStorage.getItem("idToken") || "",
          },
        });

        const response = await fetch(API.BASE_URL + API.VERIFICATION_STATUS, {
          method: "GET",
          headers: {
            authorization: localStorage.getItem("idToken") || "",
          },
        }).then((res) => res.json());

        if (response.status === "approved") {
          router.push("/");
        } else {
          setVerificationStatus(response);
          setShowModal(true);
        }
      }
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        setError("Wrong password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        setError("User not found. Please try again.");
      } else {
        setError("Failed to log in");
      }
    }
    setIsLoading(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "url(images/loginscreen.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "30rem",
          height: "13.4375rem",
          left: "5.25rem",
          top: "calc(50% - 10rem)",
          padding: "4rem",
          borderRadius: "4px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          color: "white",
        }}
      >
        <Typography
          variant="h2"
          align="left"
          mb={3}
          sx={{
            fontSize: "6rem",
            fontFamily: "'Abril Fatface', cursive",
            marginBottom: "-1rem",
          }}
        >
          HA<span style={{ fontSize: "6rem" }}>$</span>HTANK
        </Typography>
        <Typography
          variant="body1"
          align="left"
          mb={3}
          sx={{
            fontSize: "1.5rem",
            letterSpacing: "0.3rem",
            marginLeft: "1.3rem",
          }}
        >
          where creativity meets capital
        </Typography>
      </div>
      <div
        style={{
          backgroundColor: "white",
          padding: "5rem",
          borderRadius: "4px",
          width: "31.25rem",
          marginRight: "-50rem",
        }}
      >
        {error && <Alert severity="error">{error}</Alert>}

        <Typography variant="h5" align="center" mb={3}>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email address"
            type="email"
            inputRef={emailRef}
            required
            fullWidth
            margin="normal"
          />

          <TextField
            label="Password"
            type="password"
            inputRef={passwordRef}
            required
            fullWidth
            margin="normal"
          />

          <Typography align="right" mt={1}>
            <Link href="/forgetPasswordPage" color="primary">
              Forgot Password?
            </Link>
          </Typography>

          <Button
            variant="contained"
            type="submit"
            fullWidth
            color="primary"
            style={{ marginTop: 16 }}
          >
            Login
          </Button>
        </form>

        <Typography align="center" mt={2}>
          <Link href="/signup" color="var(--button-color)">
            I am a new user
          </Link>
        </Typography>
      </div>
      {isLoading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255, 255, 255, 0.8)",
            zIndex: 9999,
          }}
        >
          <CircularProgress color="primary" />
        </div>
      )}

      <Modal open={showModal} onClose={handleCloseModal}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" align="center" mb={3}>
            Your account is not yet approved
          </Typography>
          {verificationStatus && (
            <>
              <Typography variant="body1" align="center" mb={1}>
                Verification status: {verificationStatus.status}
              </Typography>
              {/* <Typography variant="body1" align="center" mb={3}>
                Message: {verificationStatus.message}
              </Typography> */}
            </>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default LoginPage;
