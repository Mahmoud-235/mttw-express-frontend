import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardAPI } from '../../services/api';

export const fetchDashboard = createAsyncThunk('dashboard/fetch', async (_, { rejectWithValue }) => {
  try { const res = await dashboardAPI.get(); return res.data.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchDashboard.pending,   (s) => { s.loading = true; s.error = null; })
     .addCase(fetchDashboard.fulfilled, (s, a) => { s.loading = false; s.data = a.payload; })
     .addCase(fetchDashboard.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
  },
});
export default dashboardSlice.reducer;
