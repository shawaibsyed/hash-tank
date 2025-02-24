import { API } from "@/constants/api.constants";
import {
  Avatar,
  Button,
  Card,
  Fab,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import UserPost from "./UserPost";
import InvestModal from "./InvestModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { fetchProfile } from "@/slice/ProfileSlice";
import { fetchtags } from "@/slice/TagsSlice";
import { useRouter } from "next/router";
import { fetchData } from "@/slice/SearchSlice";
import { SealCheck } from "@phosphor-icons/react";

function getRandomColor(uniqueString: string) {
  if (!uniqueString) {
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

const PublicPage: React.FC<ProfilePropsType> = (props: ProfilePropsType) => {
  const [userProfile, setUserProfile] = useState<any>();
  const [ffg, setFfg] = useState(false);
  const [ffcount, setFfcount] = useState<any>(0);
  const [followers, setFollowers] = useState(0);
  const [invModal, setInvModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { profile } = useSelector((state: RootState) => state.profile);
  const tags = useSelector((state: RootState) => state.tags.tags);
  const { searchbase } = useSelector((state: RootState) => state.searchbase);

  useEffect(() => {
    if (profile.length == 0) {
      dispatch(fetchProfile());
    }

    if (tags.length == 0) {
      dispatch(fetchtags());
    }

    if (searchbase.length == 0) {
      dispatch(fetchData());
    }
    const fetchProfileById = async () => {
      try {
        const response = await fetch(
          API.BASE_URL + API.GET_PUBLIC_PROFILE.route + `/${props.userId}`,
          {
            method: API.GET_PUBLIC_PROFILE.method,
            headers: {
              authorization: localStorage.getItem("idToken") || "",
            },
          }
        );
        const responseData = await response.json();

        setUserProfile(responseData);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchFFP = async () => {
      try {
        const response = await fetch(
          API.BASE_URL + API.FFP.route + `/${props.userId}`,
          {
            method: API.FFP.method,
            headers: {
              authorization: localStorage.getItem("idToken") || "",
            },
          }
        );
        const responseData = await response.json();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchFFG = async () => {
      try {
        const response = await fetch(
          API.BASE_URL + API.FFG.route + `/${props.userId}`,
          {
            method: API.FFG.method,
            headers: {
              authorization: localStorage.getItem("idToken") || "",
            },
          }
        );
        const responseData = await response.json();
        console.log(responseData.status);
        setFfg(responseData.status);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchFFC = async () => {
      try {
        const response = await fetch(
          API.BASE_URL + API.FFC.route + `/${props.userId}`,
          {
            method: API.FFC.method,
            headers: {
              authorization: localStorage.getItem("idToken") || "",
            },
          }
        );
        const responseData = await response.json();
        console.log(responseData);
        setFfcount(responseData);
        setFollowers(responseData.followers);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfileById();
    fetchFFG();
    fetchFFC();
  }, [router]);

  const handleFollowClick = () => {
    setFfg((prev) => !prev);
    setFollowers((prevCount: number) => (ffg ? prevCount - 1 : prevCount + 1));
    const fetchFFP = async () => {
      try {
        const response = await fetch(
          API.BASE_URL + API.FFP.route + `/${props.userId}`,
          {
            method: API.FFP.method,
            headers: {
              authorization: localStorage.getItem("idToken") || "",
            },
          }
        );
        const responseData = await response.json();
      } catch (error) {
        console.log(error);
      }
    };
    fetchFFP();
  };

  const handleDollarClick = () => {
    setInvModal(true);
  };

  const onInvestModalClose = () => {
    setInvModal(false);
  };

  return (
    <div>
      <style jsx>{`
        ::-webkit-scrollbar {
          display: none; /* Hide the scrollbar */
        }
      `}</style>
      <div style={{ width: "93rem", height: "100vh", overflowY: "auto" }}>
        {userProfile && (
          <div>
            <Card
              sx={{
                marginLeft: "1.5rem",
                marginTop: "1rem",
                height: "45vh",
                boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px",
                width: "97%",
              }}
            >
              <div
                style={{
                  backgroundImage: `url(${API.BASE_URL}${API.GET_BG_PIC.route}/${userProfile.profileBackgroundPic})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "50%",
                }}
              ></div>

              <Grid item xs={3} style={{ display: "flex", marginLeft: "6rem" }}>
                {/* Profile Picture */}
                {/* <Avatar
                src={`${API.BASE_URL}${API.GET_PROFILE_PIC.route}/${userProfile.profilePic}`}
                alt={userProfile.name}
                style={{ width: "180px", height: "180px", marginTop: "-6rem" }}
              /> */}
                <Avatar
                  src={`${API.BASE_URL}${API.GET_PROFILE_PIC.route}/${userProfile.profilePic}`}
                  alt={userProfile.name}
                  style={{
                    width: "180px",
                    height: "180px",
                    marginTop: "-6rem",
                    marginLeft: "-2.5rem",
                    ...getRandomColor(
                      userProfile.userId || "just a random string"
                    ),
                    fontSize: "4rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {userProfile.name ? userProfile.name.charAt(0) : ""}
                </Avatar>
              </Grid>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={1}>
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      marginTop: "2rem",
                      paddingLeft: "4rem",
                    }}
                  >
                    <Typography
                      variant="h3"
                      style={{ fontSize: "var(--fs-heading)" }}
                    >
                      <span className="gradient-text">{userProfile.name}</span>
                      {userProfile.role === "titan" && (
                        <SealCheck size={32} color="#00a3f5" weight="fill" />
                      )}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      style={{ fontSize: "var(--fs-normal)" }}
                    >
                      <span className="gradient-text">{userProfile.email}</span>
                    </Typography>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={4}
                  style={{
                    padding: "0rem",
                    marginLeft: "22rem",
                    marginTop: "-2rem",
                  }}
                >
                  {/* About Me */}
                  <Typography
                    variant="h6"
                    className="gradient-text"
                    style={{ fontSize: "var(--fs-normal)" }}
                  >
                    About Me
                  </Typography>
                  <Typography
                    style={{
                      fontSize: "var(--fs-normal)",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      hyphens: "auto",
                    }}
                  >
                    {userProfile.aboutMe}
                  </Typography>
                </Grid>
                <Grid
                  container
                  spacing={1.5}
                  style={{
                    width: "30%",
                    marginTop: "-2.5rem",
                    marginLeft: "2rem",
                  }}
                >
                  <Grid item xs={6}>
                    <Typography
                      variant="h5"
                      className="gradient-text"
                      style={{
                        fontSize: "var(--fs-sub-heading)",
                        textAlign: "center",
                      }}
                    >
                      {followers}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: "var(--fs-normal)",
                        textAlign: "center",
                      }}
                    >
                      Followers
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography
                      variant="h5"
                      className="gradient-text"
                      style={{
                        fontSize: "var(--fs-sub-heading)",
                        textAlign: "center",
                      }}
                    >
                      {ffcount?.following}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: "var(--fs-normal)",
                        textAlign: "center",
                      }}
                    >
                      Following
                    </Typography>
                  </Grid>
                  {userProfile.userId != profile.userId && (
                    <Button
                      variant="contained"
                      onClick={handleFollowClick}
                      style={{
                        height: "2.5rem",
                        width: "70%",
                        marginLeft: "5rem",
                        marginTop: "2rem",
                      }}
                    >
                      {!ffg ? "Follow" : "Unfollow"}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Card>
            <Card
              sx={{
                padding: "2rem",
                paddingTop: "0.5rem",
                marginTop: "2rem",
                marginLeft: "1.5rem",
                height: "50rem",
                overflowY: "auto",
                width: "93%",
                boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px",
                scrollbarWidth: "thin",
                scrollbarColor: "transparent transparent",
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "transparent",
                },
              }}
            >
              <UserPost
                profile={userProfile}
                prodName={props.prodName}
                privateProfile={false}
              />
            </Card>
            {((profile.role =='titan' && userProfile.role== 'pitcher') || (profile.role =='pitcher' && userProfile.role== 'titan'))  && (
              <Fab
                aria-label="Investment Panel"
                style={{
                  position: "fixed",
                  bottom: "5rem",
                  right: "3rem",
                  borderRadius: "60%",
                  width: "6rem",
                  height: "6rem",
                  backgroundColor: "var(--button-color)",
                }}
                onClick={handleDollarClick}
              >
                <LocalAtmIcon
                  style={{ width: "2.5rem", height: "3rem", color: "white" }}
                />
              </Fab>
            )}
          </div>
        )}

        {invModal && (
          <Modal open={true} onClose={onInvestModalClose}>
            <InvestModal
              userProfile={
                profile.role == "titan" && userProfile.role == "pitcher"
                  ? userProfile
                  : profile
              }
              userId={
                userProfile.userId
              }
              onClose={onInvestModalClose}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default PublicPage;

type ProfilePropsType = {
  userId: string;
  prodName: string;
};
