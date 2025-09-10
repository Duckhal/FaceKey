import * as React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IntroScreen from './src/screens/IntroScreen';
import AuthScreens from './src/screens/auth-screens/Layout'
import { enableScreens } from 'react-native-screens';
import { useColorScheme } from 'react-native';

enableScreens();

type AppStackParamList = {
  Intro: undefined,
  Auth: undefined,
}
const Stack = createNativeStackNavigator<AppStackParamList>();

const App = () => {
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator initialRouteName="Intro">
        <Stack.Screen
          name="Intro"
          component={IntroScreen}
          options={{ headerShown: false, animation: 'fade' }}
        />
        <Stack.Screen
          name="Auth"
          component={AuthScreens}
          options={{ headerShown: false, animation: 'fade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
