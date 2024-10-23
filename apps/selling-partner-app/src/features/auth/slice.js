import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  access: null,
  refresh: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: {
      reducer(state, action) {
        return {
          ...state,
          isAuthenticated: true,
          user: action.payload.supplier,
          access: action.payload.access,
          refresh: action.payload.refresh,
        };
      },
    },
    clearUser: {
      reducer() {
        return {
          ...initialState,
        };
      },
    },
    updateTokens: {
      reducer(state, action) {
        return {
          ...state,
          access: action.payload.access,
          refresh: action.payload.refresh,
        };
      },
    },
  },
});

export const selectSupplier = (state) => state.auth.user?.supplier;

export const { setUser, clearUser, updateTokens } = authSlice.actions;

export default authSlice.reducer;