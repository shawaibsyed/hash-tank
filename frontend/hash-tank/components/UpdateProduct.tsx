import { API } from "@/constants/api.constants";
import { investmentRounds } from "@/constants/investmentRound.constants";
import { fetchData } from "@/slice/SearchSlice";
import { RootState } from "@/store";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Fuse from "fuse.js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const currencies = [
  {
    value: "₹",
    label: "₹",
  },
  {
    value: "$",
    label: "$",
  },
  {
    value: "€",
    label: "€",
  },
  {
    value: "฿",
    label: "฿",
  },
];

function UpdateProduct() {
  const { profile } = useSelector((state: RootState) => state.profile);

  const [selectedProduct, setSelectedProduct] = useState<string | null>();
  const [description, setDescription] = useState("");
  const [revenue, setRevenue] = useState("");
  const [profitPercent, setProfitPercent] = useState("");
  const [productURL, setProductURL] = useState("");
  const [stage, setStage] = useState("");
  const [requiredMoney, setRequiredMoney] = useState("");
  const [equityPercentage, setEquityPercentage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currencyInReqMoney, setCurrencyInReqMoney] = useState("₹");
  const [currencyInRev, setCurrencyInRev] = useState("₹");
  const [isPublic, setIsPublic] = useState(false);

  const router = useRouter();

  const { searchbase } = useSelector((state: RootState) => state.searchbase);


  


  const tag = useSelector((state: RootState) => state.tags.tags);
  const fuse = new Fuse(tag, {
    includeScore: true,
  });

  useEffect(() => {
    if(searchbase.length ==0){
      dispatch(fetchData());
    }
  },[])

  const handleTagChange = (event: React.ChangeEvent<{}>, value: string[]) => {
    setTags(value);
  };

  const handleDeleteTag = (tag: string) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
  };

  const handleProductChange = (event: SelectChangeEvent<string | null>) => {
    setSelectedProduct(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission here
    if(!selectedProduct){
      alert("Please select a product");
      return;
    }

    if (tags.length < 3) {
      alert("please select atleast three tags");
      return;
    }

    const revenueWithCurrency = currencyInRev + revenue;
    const requiredMoneyWithCurrency = currencyInReqMoney + requiredMoney;


    try{
      fetch(API.BASE_URL + API.UPDATE_PRODUCT.route + `/${selectedProduct}`, {
        method: API.UPDATE_PRODUCT.method,
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("idToken") || "",
        },
        body: JSON.stringify({
          tags: tags,
          stages: stage,
          productUrl: productURL,
          profitPer: Number(profitPercent),
          revenue: revenueWithCurrency,
          desc: description,
          equity: {
            per: Number(equityPercentage),
            value: requiredMoneyWithCurrency,
          },
          isPublic: !isPublic,
        }),
      })
      .then((response)=>{
        router.push('/profilePage');
      })
    }catch (error) {
      alert("Failed to update product");
    };
  };

  return (
    <Card
      sx={{
        color: "#ffffff",
        marginTop: "1rem",
        marginBottom: "1rem",
        marginLeft: "10rem",
        width:"100vh",
        height:"74vh",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        padding: "5rem",
        overflow: "auto",

        //hide scrollbar
        scrollbarWidth: "thin", // For Firefox
        scrollbarColor: "transparent transparent", // For Firefox
        "-ms-overflow-style": "none", // For Microsoft Edge
        "&::-webkit-scrollbar": {
          width: "0.4em",
          backgroundColor: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "transparent",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
      <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            style={{
              paddingBottom: "0.5rem",
              marginBottom: "1rem",
              marginLeft: "2rem",
              fontFamily: "'Abril Fatface', cursive",
            }}
          >
            <span className="gradient-text">Update Product</span>
          </Typography>
          <FormControlLabel
            control={<Switch checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}/>}
            label="Private"
            sx={{ color: "black" }}
          />
        </div>
        <InputLabel>Product Name</InputLabel>
        <Select
          label="Product Name"
          value={selectedProduct}
          onChange={handleProductChange}
          fullWidth
          style={{ width: "100%", background: "#fff" }}
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
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          required
          rows={4}
          margin="normal"
          style={{ width: "100%", background: "#fff" }}
        />
        <TextField
          label="Product URL"
          value={productURL}
          onChange={(e) => setProductURL(e.target.value)}
          fullWidth
          required
          margin="normal"
          style={{ width: "100%", background: "#fff" }}
        />
        <FormControl
          fullWidth
          margin="normal"
          required
          style={{ width: "100%", background: "#fff" }}
        >
          <InputLabel>Stage</InputLabel>
          <Select
            value={stage}
            label="Stage"
            onChange={(e) => setStage(e.target.value as string)}
          >
            {investmentRounds.map((round) => (
              <MenuItem key={round.value} value={round.value}>
                {round.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            marginBottom: "1rem",
            marginTop: "1rem",
          }}
        >
          <TextField
            // id="standard-select-currency"
            select
            label="Select"
            defaultValue="₹"
            helperText="currency"
            // variant="standard"
            onChange={(e) => setCurrencyInRev(e.target.value as string)}
            style={{
              width: "8%",
              background: "#fff",
              position: "relative",
              top: "10px",
            }}
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Revenue"
            value={revenue}
            required
            onChange={(e) => {
              const input = e.target.value;
              const numbersOnly = input.replace(/[^0-9]/g, ""); // Remove any non-digit characters

              if (input === numbersOnly) {
                setRevenue(numbersOnly);
              }
            }}
            style={{
              width: "30%",
              background: "#fff",
              position: "relative",
              right: "7%",
            }}
          />
          <TextField
            label="Profit Percent"
            value={profitPercent}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            required
            onChange={(e) => {
              const input = e.target.value;
              const numbersOnly = input.replace(/[^0-9]/g, ""); // Remove any non-digit characters

              if (input === numbersOnly) {
                setProfitPercent(numbersOnly);
              }
            }}
            style={{ width: "45%", background: "#fff" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <TextField
            // id="standard-select-currency"
            select
            label="Select"
            defaultValue="₹" 
            helperText="currency"
            onChange={(e) => setCurrencyInReqMoney(e.target.value as string)}
            // variant="standard"
            style={{
              width: "8%",
              background: "#fff",
              position: "relative",
              top: "10px",
            }}
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Required Money"
            value={requiredMoney}
            required
            onChange={(e) => {
              const input = e.target.value;
              const numbersOnly = input.replace(/[^0-9]/g, ""); // Remove any non-digit characters

              if (input === numbersOnly) {
                setRequiredMoney(numbersOnly);
              }
            }}
            style={{
              width: "30%",
              background: "#fff",
              position: "relative",
              right: "7%",
            }}
          />
          <TextField
            label="Equity Percentage"
            value={equityPercentage}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            required
            onChange={(e) => {
              const input = e.target.value;
              const numbersOnly = input.replace(/[^0-9]/g, ""); // Remove any non-digit characters

              if (input === numbersOnly) {
                if (numbersOnly === "") {
                  setEquityPercentage(""); // Set the value to null if the input is empty
                } else {
                  const parsedValue = parseInt(numbersOnly, 10); // Parse the numeric value

                  if (parsedValue >= 0 && parsedValue <= 100) {
                    setEquityPercentage(parsedValue.toString());
                  } else {
                    // Show an error message or handle the error condition
                  }
                }
              }
            }}
            style={{ width: "45%", background: "#fff" }}
          />
        </div>
        
        <FormControl
          fullWidth
          margin="normal"
          style={{ width: "90%", marginTop: "2rem" }}
        >
          <InputLabel>Select Appropriate Tags</InputLabel>
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: "1rem" }}
        >
          Submit
        </Button>
      </form>
    </Card>
  );
}

export default UpdateProduct;
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}

