import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from './Layout';
import api from '../../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyOtp'>;

const VerifyOtpScreen = ({ navigation, route }: Props) => {
  const { email } = route.params;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Function to start the countdown
  const startTimer = () => {
    setTimer(60);
    setIsResendDisabled(true);
    
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 2. Chạy đếm ngược ngay khi vào màn hình
  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // 3. Handle Resend OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      await api.post('/auth/forgot-password', { email });
      Alert.alert('Success', 'A new OTP has been sent.');
      
      startTimer();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Cannot resend OTP';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Verify
  const handleVerify = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert('Error', 'Please enter the full 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/verify-otp', { email, otp });
      navigation.navigate('ResetPassword', { email, otp });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid OTP';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>
            A 6-digit code has been sent to your email:{'\n'}
            <Text style={{ fontWeight: 'bold', color: '#fff' }}>{email}</Text>
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter OTP (6 digits)"
            placeholderTextColor="#666"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>

          {/* RESEND OTP AREA */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            {isResendDisabled ? (
              <Text style={styles.timerText}>Resend in {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={handleResendOtp}>
                <Text style={styles.resendLink}>Resend</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#7b5cff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    color: '#aaa',
    fontSize: 14,
  },
  resendLink: {
    color: '#7b5cff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timerText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
});