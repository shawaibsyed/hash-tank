import { API } from "@/constants/api.constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState: any = {
  profile: [],
};

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (thunkApi) => {
    try {
      const response = await fetch(API.BASE_URL + API.PROFILE, {
        method: "GET",
        headers: {
          authorization: localStorage.getItem("idToken") || "",
        },
      }).then((res) => res.json());
      console.log(response.body);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfileData: (state, action) => {
      state.profile = action.payload;
    },
    updateBackgroundImageUUID: (state, action) => {
      const newBGPic = action.payload; // Assuming the payload contains the new profilePic value
      const { profileBackgroundPic, ...restOfTheProfile } = state.profile;
      return {
        profile: {
          ...restOfTheProfile,
          profileBackgroundPic: newBGPic,
        },
      };
    },
    updateProfileImageUUID: (state, action) => {
      const newProfilePic = action.payload; // Assuming the payload contains the new profilePic value
      const { profilePic, ...restOfTheProfile } = state.profile;
      return {
        profile: {
          ...restOfTheProfile,
          profilePic: newProfilePic,
        },
      };
    },
    updatePitch: (state, action) => {
      const postId = action.payload;
      const { posts, ...restOfTheProfile } = state.profile;
      const updatedPosts = [...posts, postId]; // Create a new array with the updated value
      return {
        profile: {
          ...restOfTheProfile,
          posts: updatedPosts,
        },
      };
    },
    updateProductList: (state, action) => {
      const productId = action.payload;
      const { products, ...restOfTheProfile } = state.profile;
      const updatedProducts = [...products, productId];
      return {
        profile: {
          ...restOfTheProfile,
          products: updatedProducts,
        },
      };
    },
    deletePitch: (state, action) => {
      const postId = action.payload;
      const { posts, ...restOfTheProfile } = state.profile;
      const updatedPosts = posts.filter((post: string) => post !== postId);
      return {
        profile: {
          ...restOfTheProfile,
          posts: updatedPosts,
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    });
  },
});

export const {
  updateProfileData,
  updateBackgroundImageUUID,
  updateProfileImageUUID,
  updatePitch,
  updateProductList,
  deletePitch,
} = profileSlice.actions;
export default profileSlice.reducer;

// export interface ProfileState {
//     profiles: Profile[];
//   }

// export interface Profile {
//   userId: string;
//   name: string;
//   username: string;
//   aboutMe: string;
//   role: string;
//   isVerified: boolean;
//   profilePic: string;
//   profileBackgroundPic: string;
//   posts: string[];
//   tags: string[];
// }
