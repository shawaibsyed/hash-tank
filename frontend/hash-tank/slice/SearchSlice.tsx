import { API } from "@/constants/api.constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState: any = {
  searchbase: [],
};

export const fetchData = createAsyncThunk(
  "data/fetchdata",
  async (thunkApi) => {
    try {
      const response = await fetch(API.BASE_URL + API.LOAD_SEARCH_BASE.route, {
        method: API.LOAD_SEARCH_BASE.method,
      }).then((res) => res.json());
      console.log("*******");
      console.log(response);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

const searchBaseSlice = createSlice({
  name: "searchbase",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
        console.log("###########");
      console.log(action.payload);
      state.searchbase = action.payload;
    });
  },
});

export default searchBaseSlice.reducer;
