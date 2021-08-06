import { RootState } from "./../configStore";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { auth, provider } from "../../firebase";

type UserStateValue = string | null | undefined;

export interface UserState {
  name: UserStateValue;
  email: UserStateValue;
  photoURL: UserStateValue;
}

const initialState: UserState = {
  name: null,
  email: null,
  photoURL: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserLoginDetails: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.photoURL = action.payload.photoURL;
    },
    setSignOutState: (state) => {
      state.name = null;
      state.email = null;
      state.photoURL = null;
    },
  },
  extraReducers: (builder) => {},
});
export const { setUserLoginDetails, setSignOutState } = userSlice.actions;
export const getUser = (state: RootState) => state.user;
export default userSlice.reducer;
