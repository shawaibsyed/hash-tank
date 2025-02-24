import { configureStore, } from '@reduxjs/toolkit';
import profileReducer from "./slice/ProfileSlice"
import tagsReducer from './slice/TagsSlice';
import notificationReducer from './slice/NotificationSlice';
import searchBaseReducer from './slice/SearchSlice';
import connectionReducer from './slice/ConnectionsSlice';

export const store = configureStore({
  reducer:{
    profile:profileReducer,
    tags:tagsReducer,
    notification:notificationReducer,
    searchbase:searchBaseReducer,
    connection:connectionReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

