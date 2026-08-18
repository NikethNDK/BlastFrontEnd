import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../services/AppinfoService';

// Async thunk to fetch current user from /me/ endpoint
export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/me/`, {
                withCredentials: true, // Send cookies with request
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Failed to fetch user' });
        }
    }
);

// Async thunk to login user
export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            // First validate credentials with server
            const loginResponse = await axios.post(`${BASE_URL}/login-view/`, credentials, {
                withCredentials: true,
            });

            // If login successful, the server sets the JWT cookie
            // Now fetch full user details from view_login
            const usersResponse = await axios.get(`${BASE_URL}/view_login`, {
                withCredentials: true,
            });

            // Find the logged-in user
            const foundUser = usersResponse.data.find(
                (user) =>
                    user.user_name.toLowerCase() ===
                    (credentials.user_name || credentials.username || "").trim().toLowerCase()
            );

            if (foundUser && foundUser.is_active) {
                return foundUser;
            }

            return rejectWithValue({ error: 'User not found or inactive' });
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Login failed' });
        }
    }
);

// Async thunk to logout user
export const logoutUser = createAsyncThunk(
    'user/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            await axios.post(`${BASE_URL}/logout/`, {}, {
                withCredentials: true,
            });
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Logout failed' });
        }
    }
);

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start with loading true to check auth on app load
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchCurrentUser
            .addCase(fetchCurrentUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.user = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                // Don't set error for 401 - it's expected when not logged in
                state.error = action.payload?.error === 'No authentication token found' ? null : action.payload?.error;
            })
            // loginUser
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.user = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.error = action.payload?.error || 'Login failed';
            })
            // logoutUser
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.error = null;
            });
    },
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
