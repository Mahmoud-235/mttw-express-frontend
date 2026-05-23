import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersAPI } from '../../services/api';

export const fetchWorkers  = createAsyncThunk('workers/fetch',  async (_, { rejectWithValue }) => { try { const r = await usersAPI.getWorkers(); return r.data.data; } catch(e) { return rejectWithValue(e.response?.data?.message); } });
export const addWorker     = createAsyncThunk('workers/add',    async (data, { rejectWithValue }) => { try { const r = await usersAPI.addWorker(data); return r.data.data; } catch(e) { return rejectWithValue(e.response?.data?.message); } });
export const removeWorker  = createAsyncThunk('workers/remove', async (id, { rejectWithValue }) => { try { await usersAPI.deleteWorker(id); return id; } catch(e) { return rejectWithValue(e.response?.data?.message); } });

const workersSlice = createSlice({
  name: 'workers', initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchWorkers.pending,   (s) => { s.loading = true; })
     .addCase(fetchWorkers.fulfilled, (s, a) => { s.loading = false; s.items = a.payload || []; })
     .addCase(fetchWorkers.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(addWorker.fulfilled,    (s, a) => { s.items.push(a.payload); })
     .addCase(removeWorker.fulfilled, (s, a) => { s.items = s.items.filter(x => x._id !== a.payload); });
  },
});
export default workersSlice.reducer;
