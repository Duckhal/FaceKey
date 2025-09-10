import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './LoginScreen'
import RegisterScreen from './RegisterScreen'
import MainLayout from '../main-screens/MainLayout'

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
}

const Stack = createNativeStackNavigator<AuthStackParamList>()

const Layout = () => {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen
        name='Login'
        component={LoginScreen}
        options={{headerShown: false}} />
      <Stack.Screen
        name='Register'
        component={RegisterScreen}
        options={{headerShown: false}} />
      <Stack.Screen
        name='Main'
        component={MainLayout}
        options={{headerShown: false}} />
    </Stack.Navigator>
  )
}

export default Layout