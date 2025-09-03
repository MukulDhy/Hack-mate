import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
    id: number;
    sender: string;
    text: string;
    time: string;
}

interface TeamState {
    members: string[];
    messages: Message[];
    currentUser: string;
}

const initialState: TeamState = {
    members: [],
    messages: [
        {
            id: 1,
            sender: 'Alice',
            text: 'Hey team, ready to build?',
            time: '10:30 AM',
        },
        {
            id: 2,
            sender: 'Bob',
            text: "Yep! Let's crush this hackathon 🚀",
            time: '10:31 AM',
        },
    ],
    currentUser: 'You',
};

const teamSlice = createSlice({
    name: 'team',
    initialState,
    reducers: {
        setMembers: (state, action: PayloadAction<string[]>) => {
            state.members = action.payload;
        },
        addMember: (state, action: PayloadAction<string>) => {
            state.members.push(action.payload);
        },
        addMessage: (state, action: PayloadAction<Omit<Message, 'id'>>) => {
            const newMessage: Message = {
                ...action.payload,
                id: state.messages.length + 1,
            };
            state.messages.push(newMessage);
        },
        setCurrentUser: (state, action: PayloadAction<string>) => {
            state.currentUser = action.payload;
        },
        clearMessages: (state) => {
            state.messages = [];
        },
    },
});

export const {
    setMembers,
    addMember,
    addMessage,
    setCurrentUser,
    clearMessages,
} = teamSlice.actions;
export default teamSlice.reducer;
