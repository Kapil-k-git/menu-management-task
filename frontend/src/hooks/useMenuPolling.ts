import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchMenuById } from '@/store/slices/menuSlice';

export const useMenuPolling = (intervalMs: number = 3000, pollingEnabled: boolean = true) => {
  const dispatch = useAppDispatch();
  const { currentMenu } = useAppSelector(state => state.menu);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentMenu || !pollingEnabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up polling for the current menu
    intervalRef.current = setInterval(() => {
      console.log('Polling for menu updates...', currentMenu.id);
      dispatch(fetchMenuById(currentMenu.id));
    }, intervalMs);

    // Cleanup on unmount or when currentMenu changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentMenu, dispatch, intervalMs, pollingEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
};
