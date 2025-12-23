import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// Memoized selectors for chat state
const selectChatState = (state: RootState) => state.chat;

export const selectChatMessages = createSelector(
  [selectChatState],
  (chat) => chat.messages
);

export const selectChatIsOpen = createSelector(
  [selectChatState],
  (chat) => chat.isOpen
);

export const selectChatIsFullscreen = createSelector(
  [selectChatState],
  (chat) => chat.isFullscreen
);

export const selectChatIsStreaming = createSelector(
  [selectChatState],
  (chat) => chat.isStreaming
);

export const selectChatError = createSelector(
  [selectChatState],
  (chat) => chat.error
);

export const selectChatSessions = createSelector(
  [selectChatState],
  (chat) => chat.sessions
);

export const selectChatCurrentSessionId = createSelector(
  [selectChatState],
  (chat) => chat.currentSessionId
);

export const selectChatUnreadCount = createSelector(
  [selectChatState],
  (chat) => chat.unreadCount
);

export const selectChatShowTooltip = createSelector(
  [selectChatState],
  (chat) => chat.showTooltip
);

export const selectChatUserInteracted = createSelector(
  [selectChatState],
  (chat) => chat.userInteracted
);

export const selectChatLastInteractivePromptTime = createSelector(
  [selectChatState],
  (chat) => chat.lastInteractivePromptTime
);

// Memoized selectors for theme state
const selectThemeState = (state: RootState) => state.theme;

export const selectTheme = createSelector(
  [selectThemeState],
  (theme) => theme.theme
);

