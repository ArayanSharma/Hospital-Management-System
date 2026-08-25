import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      localStorage.setItem("accessToken", accessToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;