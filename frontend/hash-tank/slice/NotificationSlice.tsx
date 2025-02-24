import { API } from "@/constants/api.constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState: any = {
  notification: [],
};

export const fetchNotification = createAsyncThunk(
  "notifications/fetchNotifications",
  async (thunkApi) => {
    try {
      const response = await fetch(API.BASE_URL + API.GET_NOTIFICATION.route, {
        method: API.GET_NOTIFICATION.method,
        headers: {
          authorization: localStorage.getItem("idToken") || "",
        },
      }).then((res) => res.json());

      return response.notification;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    updateAll: (state, action) => {
      // state.notification = action.payload;

      return {
        ...state,
        notification: action.payload,
      };
    },
    updateNotification: (state, action) => {
      const updatedNotification = [...state.notification, action.payload];
      return {
        ...state,
        notification: updatedNotification,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotification.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.notification = action.payload;
    });
  },
});

export default notificationSlice.reducer;

export const { updateNotification, updateAll } = notificationSlice.actions;
