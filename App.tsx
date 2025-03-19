import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, useColorScheme } from 'react-native';
import HomeScreen from './android/app/src/screens/HomeScreen';
import HistoryScreen from './android/app/src/screens/HistoryScreen';
import AddTimerScreen from './android/app/src/screens/AddTimerScreen';
import { TimerProvider } from './android/app/src/context/TimerContext';

const Stack = createStackNavigator();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <TimerProvider>
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Timer Dashboard' }} 
          />
          <Stack.Screen 
            name="History" 
            component={HistoryScreen} 
            options={{ title: 'Timer History' }} 
          />
          <Stack.Screen 
            name="AddTimer" 
            component={AddTimerScreen} 
            options={{ title: 'Create New Timer' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TimerProvider>
  );
};

export default App;