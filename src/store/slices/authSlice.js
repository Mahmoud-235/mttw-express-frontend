import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';
import { connectSocket, disconnectSocket } from '../../services/socket';

const savedUser  = JSON.parse(localStorage.getItem('ecosense_user') || 'null');
const savedToken = localStorage.getItem('ecosense_token') || null;

// ── Thunks ────────────────────────────────────────────────────────────────────
export const registerUser  = createAsyncThunk('auth/register',  async (data, { rejectWithValue }) => {
  try { const res = await authAPI.register(data); return res.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Registration failed'); }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (data, { rejectWithValue }) => {
  try { const res = await authAPI.verifyOTP(data); return res.data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'OTP verification failed'); }
});

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await authAPI.login(data);
    localStorage.setItem('ecosense_token', res.data.token);
    localStorage.setItem('ecosense_user', JSON.stringify(res.data.user));
    connectSocket(res.data.user.id);
    return res.data;
  } catch (e) { return rejectWithValue(e.response?.data?.message || 'Login failed'); }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try { await authAPI.logout(); } catch (_) {}
  localStorage.removeItem('ecosense_token');
  localStorage.removeItem('ecosense_user');
  disconnectSocket();
});

// ── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:           savedUser,
    token:          savedToken,
    isAuthenticated: !!savedToken,
    loading:        false,
    error:          null,
    otpStep:        false,   // true after register → waiting for OTP
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    setUser:    (state, { payload }) => { state.user = payload; },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending,  (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled,(s) => { s.loading = false; s.otpStep = true; })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
    // Verify OTP
      .addCase(verifyOTP.pending,  (s) => { s.loading = true; s.error = null; })
      .addCase(verifyOTP.fulfilled,(s) => { s.loading = false; s.otpStep = false; })
      .addCase(verifyOTP.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
    // Login
      .addCase(loginUser.pending,  (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled,(s, a) => {
        s.loading = false; s.isAuthenticated = true;
        s.user = a.payload.user; s.token = a.payload.token;
      })
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
    // Logout
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null; s.token = null; s.isAuthenticated = false;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
