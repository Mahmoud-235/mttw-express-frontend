import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { imagesAPI } from '../../services/api';

export const fetchImages  = createAsyncThunk('images/fetch',  async (p, { rejectWithValue }) => { try { const r = await imagesAPI.getHistory(p); return r.data; } catch(e) { return rejectWithValue(e.response?.data?.message); } });
export const uploadImage  = createAsyncThunk('images/upload', async (fd, { rejectWithValue }) => { try { const r = await imagesAPI.upload(fd); return r.data.data; } catch(e) { return rejectWithValue(e.response?.data?.message); } });
export const deleteImage  = createAsyncThunk('images/delete', async (id, { rejectWithValue }) => { try { await imagesAPI.delete(id); return id; } catch(e) { return rejectWithValue(e.response?.data?.message); } });

const imagesSlice = createSlice({
  name: 'images', initialState: { items: [], total: 0, loading: false, uploading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchImages.pending,    (s) => { s.loading = true; })
     .addCase(fetchImages.fulfilled,  (s, a) => { s.loading = false; s.items = a.payload.data || []; s.total = a.payload.totalRecords || 0; })
     .addCase(fetchImages.rejected,   (s) => { s.loading = false; })
     .addCase(uploadImage.pending,    (s) => { s.uploading = true; })
     .addCase(uploadImage.fulfilled,  (s, a) => { s.uploading = false; s.items.unshift(a.payload); })
     .addCase(uploadImage.rejected,   (s) => { s.uploading = false; })
     .addCase(deleteImage.fulfilled,  (s, a) => { s.items = s.items.filter(x => x._id !== a.payload); });
  },
});
export default imagesSlice.reducer;
