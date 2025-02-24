import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Grid,
  Modal,
  Popover,
} from "@mui/material";
import { Edit, Delete, Email } from "@mui/icons-material";
import InsertCommentSharpIcon from "@mui/icons-material/InsertCommentSharp";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchProfile } from "@/slice/ProfileSlice";
import { fetchtags } from "@/slice/TagsSlice";
import VerifyIPModal from "./VerifyIPModal";
import { API } from "@/constants/api.constants";
import Link from "next/link";

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

const VerificationStatus = ["INTERESTED", "REQUESTED", "ACCEPTED", "REJECTED"];

const InvestmentCard = ({ data, onDelete }: any) => {
  const { profile } = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch<AppDispatch>();
  const [openRemarks, setOpenRemarks] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [productDetails, setProductDetails] = useState<any>();

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const openRemarkModal = () => {
    setOpenRemarks(true);
  };

  const closeRemarkModal = () => {
    setOpenRemarks(false);
  };

  useEffect(() => {
    if (profile.length === 0) {
      dispatch(fetchProfile());
      dispatch(fetchtags());
    }
  }, [dispatch, profile]);
  const isPopoverOpen = Boolean(anchorEl);

  const handleMouseEnter = async (event: any) => {
    setAnchorEl(event.currentTarget);

    try {
      const response = await fetch(API.BASE_URL + API.GET_PRODUCT_DATA.route, {
        method: API.GET_PRODUCT_DATA.method,
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("idToken") || "",
        },
        body: JSON.stringify({
          prodName: data.prodName,
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      setProductDetails(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <VerifyIPModal
            prodName={data.prodName}
            userId={profile.role == "pitcher" ? data.titanId : data.pitcherId}
            onClose={handleCloseModal}
          />
        </Modal>
      )}

      {openRemarks && (
        <Modal open={openRemarks} onClose={closeRemarkModal}>
          <div
            style={{
              width: "300px",
              height: "300px",
              backgroundColor: "#fdfcfc",
              outline: "none",
              borderRadius: "4px",
              overflow: "auto", // Make the modal scrollable
              position: "relative",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "16px",
            }}
          >
            {data.remark}
          </div>
        </Modal>
      )}
      <Card
        sx={{
          width: "86rem",
          maxHeight: "4.5rem",
          padding: "2rem",
          marginLeft: "2rem",
          marginTop: "1.5rem",
          boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.01)",
          },
        }}
      >
        <CardContent>
          <Grid container alignItems="center">
            {/* First Grid */}
            <Grid item xs={3.5}>
              <Typography
                variant="h6"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {data.prodName}
              </Typography>
              <Popover
                open={isPopoverOpen}
                anchorEl={anchorEl}
                onClose={handleMouseLeave}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                {productDetails && (
                  <div>
                    <Typography>{productDetails.title}</Typography>
                    <Typography>{productDetails.description}</Typography>
                    <Typography>{productDetails.revenue}</Typography>
                    <Typography>{productDetails.profitPer}</Typography>
                    <Typography>{productDetails.equity.value}</Typography>
                    <Typography>{productDetails.equity.per}</Typography>

                  </div>
                )}
              </Popover>
            </Grid>

            {/* Second Grid */}
            <Grid item xs={2.5}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Avatar
                    src={`${API.BASE_URL}${API.GET_PROFILE_PIC.route}/${data.profilePic}`}
                    alt={data.username}
                    style={{
                      ...getRandomColor(data.username),
                      marginRight: "8px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {data.username
                      ? data.username.charAt(0)
                      : data.name.charAt(0)}
                  </Avatar>
                </Grid>
                <Grid item>
                  <Link
                    href={`/profilePage/${
                      profile.role == "pitcher" ? data.titanId : data.pitcherId
                    }/product/all`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <Typography variant="body1">{data.username}</Typography>
                  </Link>
                </Grid>
              </Grid>
            </Grid>

            {/* Third Grid */}
            <Grid item xs={2.8}>
              <Typography variant="body1">
                {VerificationStatus[data.status]}
              </Typography>
            </Grid>

            {/* Fourth Grid */}
            <Grid item xs={3.2}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item sx={{ marginRight: "7rem" }}>
                  <IconButton onClick={() => openRemarkModal()}>
                    <InsertCommentSharpIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton>
                    <Email />
                  </IconButton>
                </Grid>
                {/* {data.status !== 1 && (
                    <Grid item>
                      <IconButton onClick={() => handleOpenModal()}>
                        <Edit />
                      </IconButton>
                    </Grid>
                  )} */}
                {data.status != 0 ? (
                  <Grid item>
                    <IconButton onClick={() => handleOpenModal()}>
                      <Edit />
                    </IconButton>
                  </Grid>
                ) : (
                  <Grid item>
                    <IconButton onClick={() => handleOpenModal()} disabled>
                      <Edit />
                    </IconButton>
                  </Grid>
                )}

                <Grid item>
                  <IconButton
                    onClick={() =>
                      onDelete(data.titanId, data.pitcherId, data.prodName)
                    }
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default InvestmentCard;

// {
//   "createdAt": "2023-06-09T13:58:50.872Z",
//   "titanId": "5wIYafmW7fTimq0tWmlCiG9vai63",
//   "prodName": "Testing",
//   "remark": "Hey! I am Interseted to invest in your product. Can we connect?",
//   "pitcherId": "9YcVguQqnXbyAxTVfHpGWyBpCr13",
//   "status": 1,
//   "updatedAt": "2023-06-09T13:58:50.872Z",
//   "username": "keshavPitcher",
//   "profilePic": "09032f7f-e9d9-4bab-9ef2-c21a0943f70e"
// }
