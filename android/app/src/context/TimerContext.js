import React, { createContext, useReducer, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Context
const TimerContext = createContext();

// Initial state
const initialState = {
  timers: [],
  history: [],
  categories: ['Workout', 'Study', 'Break', 'Other'], // Default categories
};

// Action types
const ADD_TIMER = 'ADD_TIMER';
const UPDATE_TIMER = 'UPDATE_TIMER';
const DELETE_TIMER = 'DELETE_TIMER';
const START_TIMER = 'START_TIMER';
const PAUSE_TIMER = 'PAUSE_TIMER';
const RESET_TIMER = 'RESET_TIMER';
const COMPLETE_TIMER = 'COMPLETE_TIMER';
const START_CATEGORY = 'START_CATEGORY';
const PAUSE_CATEGORY = 'PAUSE_CATEGORY';
const RESET_CATEGORY = 'RESET_CATEGORY';
const ADD_HISTORY = 'ADD_HISTORY';
const LOAD_STATE = 'LOAD_STATE';
const TICK_TIMER = 'TICK_TIMER';

// Reducer
const timerReducer = (state, action) => {
  switch (action.type) {
    case ADD_TIMER:
      return {
        ...state,
        timers: [...state.timers, action.payload],
      };
    case UPDATE_TIMER:
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.id === action.payload.id ? action.payload : timer
        ),
      };
    case DELETE_TIMER:
      return {
        ...state,
        timers: state.timers.filter(timer => timer.id !== action.payload),
      };
    case START_TIMER:
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.id === action.payload ? { ...timer, status: 'running' } : timer
        ),
      };
    case PAUSE_TIMER:
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.id === action.payload ? { ...timer, status: 'paused' } : timer
        ),
      };
    case RESET_TIMER:
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.id === action.payload ? { 
            ...timer, 
            remainingTime: timer.duration, 
            status: 'paused',
            progress: 1
          } : timer
        ),
      };
    case COMPLETE_TIMER:
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.id === action.payload ? { 
            ...timer, 
            status: 'completed', 
            remainingTime: 0,
            progress: 0
          } : timer
        ),
      };
    case START_CATEGORY:
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.category === action.payload && timer.status !== 'completed' 
            ? { ...timer, status: 'running' } 
            : timer
        ),
      };
    case PAUSE_CATEGORY:
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.category === action.payload && timer.status === 'running' 
            ? { ...timer, status: 'paused' } 
            : timer
        ),
      };
    case RESET_CATEGORY:
      return {
        ...state,
        timers: state.timers.map(timer => 
          timer.category === action.payload 
            ? { 
                ...timer, 
                remainingTime: timer.duration, 
                status: 'paused',
                progress: 1
              } 
            : timer
        ),
      };
    case TICK_TIMER:
      return {
        ...state,
        timers: state.timers.map(timer => {
          if (timer.id === action.payload && timer.status === 'running') {
            const newRemainingTime = Math.max(0, timer.remainingTime - 1);
            const newProgress = newRemainingTime / timer.duration;
            
            // Check if timer reaches halfway point
            const isHalfway = timer.duration / 2 === newRemainingTime;
            
            return {
              ...timer,
              remainingTime: newRemainingTime,
              progress: newProgress,
              reachedHalfway: isHalfway ? true : timer.reachedHalfway,
              status: newRemainingTime === 0 ? 'completed' : timer.status
            };
          }
          return timer;
        }),
      };
    case ADD_HISTORY:
      return {
        ...state,
        history: [action.payload, ...state.history],
      };
    case LOAD_STATE:
      return action.payload;
    default:
      return state;
  }
};

// Provider
export const TimerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  // Load state from AsyncStorage
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedState = await AsyncStorage.getItem('timerState');
        if (storedState) {
          dispatch({ 
            type: LOAD_STATE, 
            payload: JSON.parse(storedState) 
          });
        }
      } catch (error) {
        console.error('Failed to load state from storage:', error);
      }
    };
    
    loadState();
  }, []);

  // Save state to AsyncStorage whenever it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem('timerState', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save state to storage:', error);
      }
    };
    
    saveState();
  }, [state]);

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
};

// Custom hook for using the timer context
export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
};