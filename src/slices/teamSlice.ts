import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: number;
  teamId: string;
  senderId: string;
  text: string;
  messageType?: string;
  time: string;
  status: 'sent' | 'delivered' | 'seen';
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'away' | 'offline';
  avatar: string;
}

interface TeamState {
  members: TeamMember[];
  messages: Message[];
  currentUser: string;
}

const initialState: TeamState = {
  members: [
    { id: 1, name: 'Alex Johnson', role: 'Team Lead', status: 'active', avatar: 'AJ' },
    { id: 2, name: 'Sarah Chen', role: 'Frontend Dev', status: 'active', avatar: 'SC' },
    { id: 3, name: 'Mike Rodriguez', role: 'Backend Dev', status: 'away', avatar: 'MR' },
    { id: 4, name: 'Emma Davis', role: 'UI/UX Designer', status: 'active', avatar: 'ED' }
  ],
  messages: [
    {
      id: 1,
      teamId: 'team-1',
      senderId: 'user-1',
      text: 'Hey team, ready to build?',
      time: '10:30 AM',
      status: 'seen'
    },
    {
      id: 2,
      teamId: 'team-1',
      senderId: 'user-2',
      text: "Yep! Let's crush this hackathon 🚀",
      time: '10:31 AM',
      status: 'seen'
    },
  ],
  currentUser: 'user-1',
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setMembers: (state, action: PayloadAction<TeamMember[]>) => {
      state.members = action.payload;
    },
    addMember: (state, action: PayloadAction<TeamMember>) => {
      state.members.push(action.payload);
    },
    addMessage: (state, action: PayloadAction<Omit<Message, 'id'>>) => {
      const newMessage: Message = {
        ...action.payload,
        id: state.messages.length + 1,
      };
      state.messages.push(newMessage);
    },
    updateMessageStatus: (
      state,
      action: PayloadAction<{ id: number; status: 'sent' | 'delivered' | 'seen' }>
    ) => {
      const { id, status } = action.payload;
      const message = state.messages.find(m => m.id === id);
      if (message) {
        message.status = status;
      }
    },
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.currentUser = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    updateMemberStatus: (
      state,
      action: PayloadAction<{ id: number; status: 'active' | 'away' | 'offline' }>
    ) => {
      const { id, status } = action.payload;
      const member = state.members.find(m => m.id === id);
      if (member) {
        member.status = status;
      }
    },
  },
});

export const {
  setMembers,
  addMember,
  addMessage,
  updateMessageStatus,
  setCurrentUser,
  clearMessages,
  updateMemberStatus,
} = teamSlice.actions;

export default teamSlice.reducer;
