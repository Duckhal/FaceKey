import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useEffect } from 'react';
import Entypo from '@react-native-vector-icons/entypo';
import Feather from '@react-native-vector-icons/feather';
import Fontisto from '@react-native-vector-icons/fontisto';
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type AuthStackParamList = {
  Auth: undefined,
  Intro: undefined,
};

type IntroScreenProps = NativeStackScreenProps<AuthStackParamList, "Intro">;

export default function IntroScreen({ navigation }: IntroScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'Auth'}]
      });
    }, 1000);
    return () => clearTimeout(timer)
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>
        <Entypo name="book" color="#008000" size={40} /> FaceKey
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
  },
  appName: {
    fontWeight: 'bold',
    fontSize: 40,
    color: '#008000', 
  },
})

