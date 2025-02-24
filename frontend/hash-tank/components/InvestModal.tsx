import { API } from "@/constants/api.constants";
import { fetchProfile } from "@/slice/ProfileSlice";
import { fetchtags } from "@/slice/TagsSlice";
import { AppDispatch, RootState } from "@/store";
import {
    Button,
    MenuItem,
    Modal,
    Select,
    SelectChangeEvent,
    TextField,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
  
  interface InvestProps {
    userProfile: any;
    userId:string;
    onClose: () => void;
  }
  
  function InvestModal({ userProfile, userId, onClose }: InvestProps) {
    const [selectedProduct, setSelectedProduct] = useState<string | null>();
    const [prodData, setProdData] = useState<any>();
    const [remarks, setRemarks] = useState<string>("");
    const { profile } = useSelector((state: RootState) => state.profile);
    const dispatch = useDispatch<AppDispatch>();
    const [response,setResponse] = useState<string>("");

    

    useEffect(() => {
        if(profile.length === 0)
          dispatch(fetchProfile());
      }, [dispatch, profile]);

  
    const handleProductChange = (event: SelectChangeEvent<string | null>) => {
      setSelectedProduct(event.target.value);
    };
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

        if( !remarks)
            setRemarks(
                userProfile.role == 'titan'
                ? 'Please have a look at my product.'
                : 'Hey, I am interested to invest into your product. Can we connect?'
            );
      
      
        try {
            fetch(API.BASE_URL + API.TITAN_TO_PITCHER .route,{
                method: API.TITAN_TO_PITCHER.method,
                headers: {
                    "Content-Type": "application/json",
                    authorization: localStorage.getItem("idToken") || "",
                },
                body: JSON.stringify({
                    prodName: selectedProduct,
                    userId: userId,
                    remarks: remarks || "",
                }),
            })
            .then((res)=>res.json())
            .then((res)=> setResponse(res.message));
        } catch (error) {
            console.log(error);
        }
        onClose();
        
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
                prodName: selectedProduct,
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
      if (selectedProduct) fetchProductData();
    }, [selectedProduct]);
  
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
            height: "700px",
            backgroundColor: "#fdfcfc",
            outline: "none",
            borderRadius: "4px",
            overflow: "auto",
            position: "relative",
            padding: "16px",
          }}
        >
          <form onSubmit={handleSubmit}>
            {userProfile.role == 'pitcher' && 
                <Select
                value={selectedProduct}
                onChange={handleProductChange}
                fullWidth
                label="Product"
                variant="outlined"
                style={{ marginBottom: "16px" }}
              >
                {userProfile &&
                  userProfile.products &&
                  userProfile.products.length > 0 &&
                  userProfile.products.map((product: string) => (
                    <MenuItem key={product} value={product}>
                      {product}
                    </MenuItem>
                  ))}
              </Select>
            }
            {
                userProfile.role == 'titan' &&
                <div>
                <div>{JSON.stringify(profile) || "hello"}</div>
                <Select
              value={selectedProduct}
              onChange={handleProductChange}
              fullWidth
              label="Product"
              variant="outlined"
              style={{ marginBottom: "16px" }}
            >
              {profile &&
                profile.products &&
                profile.products.length > 0 &&
                profile.products.map((product: string) => (
                  <MenuItem key={product} value={product}>
                    {product}
                  </MenuItem>
                ))}
            </Select>
            </div>
            }
  
            {selectedProduct && prodData && (
              <div>
                <div>
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
  
            <Button
              variant="contained"
              type="submit"
              fullWidth
              color="primary"
              style={{ marginTop: 16 }}
            >
              { userProfile.role == 'pitcher'?"Invest":"Request"}
            </Button>
          </form>
          {
            response && <div>{response}</div>
          }
        </div>
      </Modal>
    );
  }
  
  export default InvestModal;  
