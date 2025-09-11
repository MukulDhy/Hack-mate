import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Hackathon, HackathonFilters, HackathonStatus } from '@/types/hackathon';
import { hackathonService } from '@/service/hackathonService';
import { updateUser } from '@/slices/authSlice';
import { useAppDispatch } from '@/hooks/redux-hooks';

interface HackathonState {
  hackathon: Hackathon;
  loading: boolean;
  error: string | null;
}

const initialState: HackathonState = {
  hackathon: null,
  joined : false,
  loading: false,
  error: null, 
};

export const userFetchHackathon = createAsyncThunk(
  'hackathon/userFetchHackathon',
  async ( id: string,{ rejectWithValue }) => {
    try {
      return await hackathonService.getById(id);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
export const userDefetchHackathon = createAsyncThunk(
  'hackathon/userDefetchHackathon',
  async ( id: string,{ rejectWithValue }) => {
    try {
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinHackathon = createAsyncThunk(
  'hackathon/userJoinHackathon',
  async ( id: string,{ rejectWithValue }) => {
    try {
           const response = await hackathonService.joinHackathon(id);
      
      // 👇 Reset currentHackathonId in auth slice
      useAppDispatch()(updateUser({ currentHackathonId: response._id }));

    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const leaveHackathon =  createAsyncThunk(
  'hackathon/userLeaveHackathon',
  async ( id: string,{ rejectWithValue }) => {
    try {
      return await hackathonService.leaveHackathon(id);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


const userHackathonSlice = createSlice({
  name: 'userHackathons',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<HackathonFilters>>) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 10,
        sortBy: 'startDate',
        sortOrder: 'desc'
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userFetchHackathon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userFetchHackathon.fulfilled, (state, action) => {
        state.loading = false;
       state.hackathon = action.payload;
      })
      .addCase(userFetchHackathon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      builder
      .addCase(userDefetchHackathon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userDefetchHackathon.fulfilled, (state) => {
        state.loading = false;
       state.hackathon = null;
      })
      .addCase(userDefetchHackathon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      builder
      .addCase(joinHackathon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinHackathon.fulfilled, (state, action) => {
        state.loading = false;
       state.hackathon = action.payload;
      })
      .addCase(joinHackathon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});


export default userHackathonSlice.reducer;