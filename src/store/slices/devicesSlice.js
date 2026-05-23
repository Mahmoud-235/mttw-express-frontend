import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { devicesAPI } from '../../services/api';

export const fetchDevices  = createAsyncThunk('devices/fetch',  async (_, { rejectWithValue }) => { try { const r = await devicesAPI.getAll(); return r.data.data; } catch(e) { return rejectWithValue(e.response?.data?.message); } });
export const createDevice  = createAsyncThunk('devices/create', async (data, { rejectWithValue }) => { try { const r = await devicesAPI.create(data); return r.data.data; } catch(e) { return rejectWithValue(e.response?.data?.message); } });
export const deleteDevice  = createAsyncThunk('devices/delete', async (id, { rejectWithValue }) => { try { await devicesAPI.delete(id); return id; } catch(e) { return rejectWithValue(e.response?.data?.message); } });

const devicesSlice = createSlice({
  name: 'devices',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchDevices.pending,   (s) => { s.loading = true; })
     .addCase(fetchDevices.fulfilled, (s, a) => { s.loading = false; s.items = a.payload || []; })
     .addCase(fetchDevices.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(createDevice.fulfilled, (s, a) => { s.items.push(a.payload); })
     .addCase(deleteDevice.fulfilled, (s, a) => { s.items = s.items.filter(x => x._id !== a.payload); });
  },
});
export default devicesSlice.reducer;
