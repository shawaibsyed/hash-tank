import { API } from "@/constants/api.constants";
import { fetchProfile } from "@/slice/ProfileSlice";
import { fetchtags } from "@/slice/TagsSlice";
import { AppDispatch, RootState } from "@/store";
import { Check, Clear } from "@mui/icons-material";
import {
  Button,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface InvestProps {
  prodName: any;
  userId: string;
  onClose: () => void;
}

function VerifyIPModal({ prodName, userId, onClose }: InvestProps) {
  // const [selectedProduct, setSelectedProduct] = useState<string | null>();
  const [prodData, setProdData] = useState<any>();
  const [remarks, setRemarks] = useState<string>("");
  const { profile } = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch<AppDispatch>();
  const [response, setResponse] = useState<string>("");
  const [status, setStatus] = useState<Number>();

  useEffect(() => {
    if (profile.length === 0) dispatch(fetchProfile());
  }, [dispatch, profile]);

  const handleSubmit = async () => {
    const UpdateProductStatus = async () => {
      try {
        const response = await fetch(API.BASE_URL + API.UPDATE_IP_DATA.route, {
          method: API.UPDATE_IP_DATA.method,
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("idToken") || "",
          },
          body: JSON.stringify({
            prodName: prodName,
            userId: userId,
            status: status,
            remark: remarks || "",
          }),
        });
        const responseData = await response.json();
        console.log(responseData);
        onClose();
      } catch (error) {
        console.log(error);
      }
    };
    UpdateProductStatus();
  };

  const handleAcceptSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(2);
    handleSubmit();
  };

  const handleRejectSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(3);
    handleSubmit();
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(
          API.BASE_URL + API.GET_PRODUCT_DATA.route,
          {
            method: API.GET_PRODUCT_DATA.method,
            headers: {
              "Content-Type": "application/json",
              authorization: localStorage.getItem("idToken") || "",
            },
            body: JSON.stringify({
              prodName: prodName,
            }),
          }
        );
        const responseData = await response.json();
        console.log(responseData);
        setProdData(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductData();
  }, []);

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
      <div
        style={{
          width: "600px",
          height: "750px",
          backgroundColor: "#fdfcfc",
          outline: "none",
          borderRadius: "4px",
          overflow: "auto",
          position: "relative",
          padding: "16px",
        }}
      >
        <form>
          {prodData && prodData.equity  && (
            <div>
              <div>
                <Typography
                  variant="h6"
                  style={{ fontWeight: "bold", marginBottom: "16px" }}
                >
                  {prodName}
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "16px" }}>
                  {prodData.desc}
                </Typography>
                <TextField
                  label="Revenue"
                  value={prodData.revenue}
                  variant="outlined"
                  fullWidth
                  disabled
                  style={{ marginBottom: "16px" }}
                />
              </div>
              <div>
                <TextField
                  label="Profit Percentage"
                  value={prodData.profitPer}
                  variant="outlined"
                  fullWidth
                  disabled
                  style={{ marginBottom: "16px" }}
                />
              </div>
              <div>
                <TextField
                  label="Required Money"
                  value={prodData.equity.value}
                  variant="outlined"
                  fullWidth
                  disabled
                  style={{ marginBottom: "16px" }}
                />
              </div>
              <div>
                <TextField
                  label="Equity Offered"
                  value={prodData.equity.per}
                  variant="outlined"
                  fullWidth
                  disabled
                  style={{ marginBottom: "16px" }}
                />
              </div>
            </div>
          )}

          <div style={{ gridColumn: "1 / span 2", marginBottom: "16px" }}>
            <TextField
              label="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              variant="outlined"
              fullWidth
              multiline
              rows={4}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <Button
              variant="contained"
              fullWidth
              style={{ backgroundColor: "green", color: "white", width: "49%" }}
              onClick={handleAcceptSubmit}
              startIcon={<Check />}
            >
              Accept
            </Button>

            <Button
              variant="contained"
              fullWidth
              style={{ backgroundColor: "red", color: "white", width: "49%" }}
              onClick={handleRejectSubmit}
              startIcon={<Clear />}
            >
              Reject
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default VerifyIPModal;
