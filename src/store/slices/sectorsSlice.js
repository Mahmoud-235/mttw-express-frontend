import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sectorsAPI } from '../../services/api';

export const fetchSectors  = createAsyncThunk('sectors/fetch',  async (_, { rejectWithValue }) => { try { const r = await sectorsAPI.getAll(); return r.data.data; } catch(e) { return rejectWithValue(e.response?.data?.message); } });
export const createSector  = createAsyncThunk('sectors/create', async (data, { rejectWithValue }) => { try { const r = await sectorsAPI.create(data); return r.data.data; } catch(e) { return rejectWithValue(e.response?.data?.message); } });
export const updateSector  = createAsyncThunk('sectors/update', async ({ id, data }, { rejectWithValue }) => { try { const r = await sectorsAPI.update(id, data); return r.data.data; } catch(e) { return rejectWithValue(e.response?.data?.message); } });
export const deleteSector  = createAsyncThunk('sectors/delete', async (id, { rejectWithValue }) => { try { await sectorsAPI.delete(id); return id; } catch(e) { return rejectWithValue(e.response?.data?.message); } });

const sectorsSlice = createSlice({
  name: 'sectors',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchSectors.pending,   (s) => { s.loading = true; })
     .addCase(fetchSectors.fulfilled, (s, a) => { s.loading = false; s.items = a.payload || []; })
     .addCase(fetchSectors.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(createSector.fulfilled, (s, a) => { s.items.push(a.payload); })
     .addCase(updateSector.fulfilled, (s, a) => { const i = s.items.findIndex(x => x._id === a.payload._id); if(i>=0) s.items[i]=a.payload; })
     .addCase(deleteSector.fulfilled, (s, a) => { s.items = s.items.filter(x => x._id !== a.payload); });
  },
});
export default sectorsSlice.reducer;
