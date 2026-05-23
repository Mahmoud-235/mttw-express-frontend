import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sensorsAPI } from '../../services/api';

export const fetchLatest   = createAsyncThunk('sensors/latest',   async (sectorId, { rejectWithValue }) => { try { const r = await sensorsAPI.getLatest(sectorId); return r.data.data; } catch(e) { return rejectWithValue(e.response?.data?.message); } });
export const fetchHistory  = createAsyncThunk('sensors/history',  async (p, { rejectWithValue }) => { try { const r = await sensorsAPI.getHistory(p); return r.data; } catch(e) { return rejectWithValue(e.response?.data?.message); } });
export const fetchAnalytics= createAsyncThunk('sensors/analytics',async (id, { rejectWithValue }) => { try { const r = await sensorsAPI.getAnalytics(id); return r.data.data; } catch(e) { return rejectWithValue(e.response?.data?.message); } });
export const runAnalysis   = createAsyncThunk('sensors/analyze',  async (id, { rejectWithValue }) => { try { const r = await sensorsAPI.analyze(id); return r.data.data; } catch(e) { return rejectWithValue(e.response?.data?.message); } });

const sensorsSlice = createSlice({
  name: 'sensors',
  initialState: { latest: null, history: [], total: 0, analytics: null, loading: false, analyzing: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchLatest.fulfilled,    (s, a) => { s.latest = a.payload; })
     .addCase(fetchHistory.pending,     (s) => { s.loading = true; })
     .addCase(fetchHistory.fulfilled,   (s, a) => { s.loading = false; s.history = a.payload.data || []; s.total = a.payload.totalRecords || 0; })
     .addCase(fetchHistory.rejected,    (s) => { s.loading = false; })
     .addCase(fetchAnalytics.fulfilled, (s, a) => { s.analytics = a.payload; })
     .addCase(runAnalysis.pending,      (s) => { s.analyzing = true; })
     .addCase(runAnalysis.fulfilled,    (s, a) => { s.analyzing = false; s.latest = a.payload; })
     .addCase(runAnalysis.rejected,     (s) => { s.analyzing = false; });
  },
});
export default sensorsSlice.reducer;
