import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchtags } from "@/slice/TagsSlice";
import { API } from "@/constants/api.constants";

const SignupPage = ({ onSignUpComplete }: any) => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState("");

  const tagsRef = useRef(false);
  const { tags } = useSelector((state: RootState) => state.tags);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (tagsRef.current === false && tags.length === 0) dispatch(fetchtags());
    tagsRef.current = true;
  }, [dispatch, tags]);

  const handleSelectChange = (event: React.ChangeEvent<{ value: any }>) => {
    setSelectedOption(event.target.value as string);
  };

  const [username, setUsername] = useState("");
  const [isUnique, setIsUnique] = useState(false);
  const [showHelperText, setShowHelperText] = useState(false);

  const checkUsernameUniqueness = async () => {
    const response = await fetch(
      API.BASE_URL + API.VALID_USERNAME + "/" + username,
      {
        method: "GET",
      }
    ).then((res) => res.json());
    setIsUnique(response.data);
  };

  useEffect(() => {
    if (username) {
      const timeout = setTimeout(checkUsernameUniqueness, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [username]);

  const handleUsernameChange = (event: any) => {
    const name = event.target.value;
    setUsername(name);
    setShowHelperText(name.length > 0);
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      passwordRef.current!.value !== "" &&
      passwordRef.current!.value !== passwordConfirmRef.current!.value
    ) {
      return setError("Passwords do not match");
    }

    //Check Unique UserName
    if (!isUnique) {
      return setError("Username is already taken");
    }

    if (selectedOption == "") {
      return setError("Select your role");
    }

    const name = usernameRef.current!.value;
    const email = emailRef.current!.value;
    const password = passwordRef.current!.value;

    const userData = {
      name: name,
      email: email,
      password: password,
      role: selectedOption,
    };

    onSignUpComplete(userData);
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
          backgroundColor: "white",
          padding: "5rem",
          borderRadius: "4px",
          width: "31.25rem",
          marginRight: "-50rem",
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
        {error && <Alert severity="error">{error}</Alert>}

        <Typography variant="h5" align="center" mb={3}>
          Register
        </Typography>
        <form onSubmit={handleSignup}>
          <TextField
            label="User Name"
            type="text"
            inputProps={{ maxLength: 20 }}
            inputRef={usernameRef}
            required
            fullWidth
            margin="normal"
            onChange={handleUsernameChange}
            error={!isUnique && username.length > 0}
            helperText={
              !isUnique && showHelperText && "This name is already taken."
            }
          />

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

          <TextField
            label="Confirm Password"
            type="password"
            inputRef={passwordConfirmRef}
            required
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="select-label">Role</InputLabel>
            <Select
              labelId="select-label"
              label="Role"
              // required
              value={selectedOption}
              onChange={handleSelectChange as any}
            >
              <MenuItem value="pitcher">Pitcher</MenuItem>
              <MenuItem value="titan">Titan</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            type="submit"
            fullWidth
            color="primary"
            style={{ marginTop: 16 }}
          >
            Next
          </Button>
        </form>

        <Typography align="center" mt={2}>
          <Link href="/login" color="primary">
            I am a registered user
          </Link>
        </Typography>
      </div>
    </div>
  );
};

export default SignupPage;
