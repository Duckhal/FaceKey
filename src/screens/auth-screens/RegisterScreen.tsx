import React, { use, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from '@react-native-vector-icons/feather';
import axios from "axios";
import { Alert } from "react-native";
import api from "../../services/api";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, "Register">;

const RegisterScreen = (props: RegisterScreenProps) => {
  const { navigation, route } = props;
  const [ username, setUsername ] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Invalid email address. Please try again.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long.');
      return;
    }

    try {
      const response = await api.post(`/auth/register`, {
        username,
        email,
        password,
    });
      Alert.alert('Registration Successful', 'You can now log in with your credentials.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Registration Failed', 'Email may already be in use. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>
        Sign up to unlock your door with just a look.
      </Text>

      {/* Username */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor='#9b9b9bff'
        keyboardType="email-address"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor='#9b9b9bff'
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor='#9b9b9bff'
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setSecureText(!secureText)}
          style={styles.eyeIcon}
        >
          <Icon name={secureText ? "eye-off" : "eye"} size={20} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Button Create Account */}
      <TouchableOpacity 
      style={styles.createBtn}
      onPress={() => handleRegister()}>
        <Text 
          style={styles.createBtnText}
        >Create new account</Text>
      </TouchableOpacity>

      {/* Login link */}
      <View style={styles.loginContainer}>
        <Text style={{ color: "#555" }}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* OR line */}
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={{ marginHorizontal: 8, color: "#999" }}>or</Text>
        <View style={styles.line} />
      </View>

      {/* Google Signin */}
      <TouchableOpacity style={styles.googleBtn}>
        <Text style={styles.googleText}>Sign up with Google</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#222",
    paddingTop: 160,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: '#eee',
    marginTop: 20,
  },
  subtitle: {
    color: "#777",
    fontSize: 14,
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 15,
    backgroundColor: "#f9f9f9",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginTop: 15,
    backgroundColor: "#f9f9f9",
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 12,
    color: "#000"
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  createBtn: {
    backgroundColor: "#7b5cff",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  createBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "center",
  },
  loginText: {
    color: "#7b5cff",
    fontWeight: "600",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  googleBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 12,
  },
  googleText: {
    fontSize: 15,
    fontWeight: "500",
    color: '#eee',
  },
});
