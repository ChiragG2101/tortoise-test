import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isViewDocumentDrawerOpen: false,
};

const rentalScheduleIdTabSlice = createSlice({
  name: 'rentalScheduleIdTab',
  initialState,
  reducers: {
    openViewDocumentDrawer(state) {
      state.isViewDocumentDrawerOpen = true;
    },
    closeViewDocumentDrawer(state) {
      state.isViewDocumentDrawerOpen = false;
    },
    resetRentalScheduleIdState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  openViewDocumentDrawer,
  closeViewDocumentDrawer,
  resetRentalScheduleIdState,
} = rentalScheduleIdTabSlice.actions;

export default rentalScheduleIdTabSlice.reducer;
