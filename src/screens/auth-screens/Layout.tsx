import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Các màn hình cũ
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import MainLayout from '../main-screens/MainLayout';
import DeviceScreen from '../main-screens/DeviceScreen'; 

// 1. IMPORT 3 MÀN HÌNH MỚI
import ForgotPasswordScreen from './ForgotPasswordScreen';
import VerifyOtpScreen from './VerifyOtpScreen';
import ResetPasswordScreen from './ResetPasswordScreen';

// 2. CẬP NHẬT DANH SÁCH PARAM
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Device: undefined;
  ForgotPassword: undefined;
  VerifyOtp: { email: string };
  ResetPassword: { email: string; otp: string };
}

const Stack = createNativeStackNavigator<AuthStackParamList>();

const Layout = () => {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen
        name='Login'
        component={LoginScreen}
        options={{headerShown: false}} 
      />
      <Stack.Screen
        name='Register'
        component={RegisterScreen}
        options={{headerShown: false}} 
      />
      
      <Stack.Screen
        name='ForgotPassword'
        component={ForgotPasswordScreen}
        options={{
            headerShown: false,
            animation: 'slide_from_right'
        }} 
      />
      <Stack.Screen
        name='VerifyOtp'
        component={VerifyOtpScreen}
        options={{
            headerShown: false,
            animation: 'slide_from_right'
        }} 
      />
      <Stack.Screen
        name='ResetPassword'
        component={ResetPasswordScreen}
        options={{
            headerShown: false,
            animation: 'slide_from_right'
        }} 
      />

      <Stack.Screen
        name='Main'
        component={MainLayout}
        options={{headerShown: false}} 
      />

      <Stack.Screen
        name='Device'
        component={DeviceScreen}
        options={{
            headerShown: false,
            title: 'Linked Devices',
            headerStyle: { backgroundColor: '#121212' },
            headerTintColor: '#fff',
            animation: 'slide_from_right'
        }} 
      />
    </Stack.Navigator>
  )
}

export default Layout;