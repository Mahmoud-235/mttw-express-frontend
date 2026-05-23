import { configureStore } from '@reduxjs/toolkit';
import authReducer     from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import sectorsReducer  from './slices/sectorsSlice';
import sensorsReducer  from './slices/sensorsSlice';
import devicesReducer  from './slices/devicesSlice';
import notifReducer    from './slices/notificationsSlice';
import workersReducer  from './slices/workersSlice';
import imagesReducer   from './slices/imagesSlice';

export const store = configureStore({
  reducer: {
    auth:          authReducer,
    dashboard:     dashboardReducer,
    sectors:       sectorsReducer,
    sensors:       sensorsReducer,
    devices:       devicesReducer,
    notifications: notifReducer,
    workers:       workersReducer,
    images:        imagesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
