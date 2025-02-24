import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Chip,
  Autocomplete,
  Card,
  FormControlLabel,
  Switch,
  InputAdornment,
} from "@mui/material";
import { investmentRounds } from "@/constants/investmentRound.constants";
import { API } from "@/constants/api.constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import Fuse from "fuse.js";
import { updateProductList } from "@/slice/ProfileSlice";
import { useRouter } from "next/router";
import { fetchData } from "@/slice/SearchSlice";

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

const CreateProductPage: React.FC = () => {
  const [product, setProduct] = useState("");
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

  const { searchbase } = useSelector((state: RootState) => state.searchbase);


  useEffect(() => {
    if(searchbase.length ==0){
      dispatch(fetchData());
    }
  },[])

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  // const history = useHistory();

  const tag = useSelector((state: RootState) => state.tags.tags);
  const fuse = new Fuse(tag, {
    includeScore: true,
  });

  const handleTagChange = (event: React.ChangeEvent<{}>, value: string[]) => {
    setTags(value);
  };

  const handleDeleteTag = (tag: string) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission here

    if (tags.length < 3) {
      alert("please select atleast three tags");
      return;
    }

    const revenueWithCurrency = currencyInRev + revenue;
    const requiredMoneyWithCurrency = currencyInReqMoney + requiredMoney;

    fetch(API.BASE_URL + API.CREATE_PRODUCT, {
      method: "POST",
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
        prodName: product,
        desc: description,
        equity: {
          per: Number(equityPercentage),
          value: requiredMoneyWithCurrency,
        },
        isPublic: !isPublic,
      }),
    })
      .then((response) => {
        const res = response.json();
        if (response.status == 409) {
          alert("product name already exists: " + product);
          return "error";
        }
        return res;
      })
      .then((product) => {
        if (product == "error") {
          return;
        }
        dispatch(updateProductList(product.prodName));
        // router.push("/profilePage");
        router.back();
      });
  };

  return (
    <Card
      sx={{
        color: "#ffffff",
        marginTop: "0.5rem",
        height: "75vh",
        marginBottom: "1rem",
        marginLeft: "5rem",
        width: "117%",
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
            <span className="gradient-text">Create Product</span>
          </Typography>
          <FormControlLabel
            control={<Switch checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}/>}
            label="Private"
            sx={{ color: "black" }}
          />
        </div>
        <TextField
          label="Product Name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          fullWidth
          required
          margin="normal"
          style={{ width: "100%", background: "#fff" }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          required
          multiline
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
            required
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
          style={{ width: "100%", marginTop: "2rem" }}
        >
          
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
              <TextField {...params} fullWidth label="Select Appropriate Tags" />
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
          style={{ marginTop: "2rem" }}
        >
          Submit
        </Button>
      </form>
    </Card>
  );
};

export default CreateProductPage;
