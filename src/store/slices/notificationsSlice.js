import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationsAPI } from '../../services/api';

export const fetchNotifications = createAsyncThunk('notifs/fetch',  async (_, { rejectWithValue }) => { try { const r = await notificationsAPI.getAll(); return r.data.data; } catch(e) { return rejectWithValue(e.response?.data?.message); } });
export const markRead           = createAsyncThunk('notifs/read',   async (id, { rejectWithValue }) => { try { await notificationsAPI.markRead(id); return id; } catch(e) { return rejectWithValue(e.response?.data?.message); } });
export const deleteNotif        = createAsyncThunk('notifs/delete', async (id, { rejectWithValue }) => { try { await notificationsAPI.delete(id); return id; } catch(e) { return rejectWithValue(e.response?.data?.message); } });

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], loading: false },
  reducers: {
    addLiveNotif: (s, a) => { s.items.unshift({ ...a.payload, isRead: false, _id: Date.now().toString() }); },
  },
  extraReducers: (b) => {
    b.addCase(fetchNotifications.fulfilled, (s, a) => { s.items = a.payload || []; })
     .addCase(markRead.fulfilled,           (s, a) => { const n = s.items.find(x => x._id === a.payload); if(n) n.isRead = true; })
     .addCase(deleteNotif.fulfilled,        (s, a) => { s.items = s.items.filter(x => x._id !== a.payload); });
  },
});
export const { addLiveNotif } = notificationsSlice.actions;
export default notificationsSlice.reducer;
