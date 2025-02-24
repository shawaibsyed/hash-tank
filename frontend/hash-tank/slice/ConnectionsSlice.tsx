import { API } from "@/constants/api.constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState: any = {
  connection: [],
};

export const fetchConnection = createAsyncThunk(
  "connections/fetchConnections",
  async (thunkApi) => {
    try {
      const response = await fetch(API.BASE_URL + API.GET_CONNECTIONS.route, {
        method: API.GET_CONNECTIONS.method,
        headers: {
          authorization: localStorage.getItem("idToken") || "",
        },
      }).then((res) => res.json());
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchConnection.fulfilled, (state, action) => {
      state.connection = action.payload;
    });
  },
});

export default connectionSlice.reducer;
