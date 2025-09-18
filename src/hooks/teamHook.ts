// hooks/useTeam.ts
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useUser } from './useUser';
import { 
  fetchUserTeam, 
  fetchTeamMessages, 
  sendMessage, 
  addLocalMessage,
  setCurrentUser 
} from '../store/slices/teamSlice';
import { AppDispatch, RootState } from '../store';

export const useTeam = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useUser();
  const teamState = useSelector((state: RootState) => state.team);

  // Initialize team with current user
  const initializeTeam = useCallback((hackathonId: string) => {
    if (user) {
      dispatch(setCurrentUser(user.id));
      dispatch(fetchUserTeam({ userId: user.id, hackathonId }));
    }
  }, [dispatch, user]);

  // Load team messages
  const loadMessages = useCallback((teamId: string, page?: number) => {
    dispatch(fetchTeamMessages({ teamId, page }));
  }, [dispatch]);

  // Send a message
  const sendTeamMessage = useCallback(async (teamId: string, text: string, messageType?: string) => {
    // Optimistically add message to UI
    dispatch(addLocalMessage({
      teamId,
      senderId: user?.id || '',
      text,
      messageType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
    
    // Send to server
    return dispatch(sendMessage({ teamId, text, messageType })).unwrap();
  }, [dispatch, user]);

  return {
    ...teamState,
    initializeTeam,
    loadMessages,
    sendTeamMessage,
  };
};