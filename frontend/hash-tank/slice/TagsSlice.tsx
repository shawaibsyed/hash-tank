import { API } from "@/constants/api.constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState: any = {
  tags: [],
};

export const fetchtags = createAsyncThunk(
  "tags/fetchTags",
  async (thunkApi) => {
    try {
      const response = await fetch(API.BASE_URL + API.GET_TAGS, {
        method: "GET",
      }).then((res) => res.json());
    //   console.log("response in slice "+ response.tags);
      return response.tags;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchtags.fulfilled, (state, action) => {
    //   console.log("action" + action.payload);
      state.tags = action.payload;
    });
  },
});

export default tagsSlice.reducer;
