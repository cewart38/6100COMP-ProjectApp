import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { ExerciseCard } from "../components/ui/ExerciseCard";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "AddWorkout">) {
  const { isDarkmode, setTheme } = useTheme();
  const [ day , setDay ] = useState<string>('');

  const getDay = async () => {
    try {
      const day = await AsyncStorage.getItem('day')
      if(day !== null) {
        setDay(day);
      }
    } catch (e) {
      console.log('Could not retrieve value')
    }
  }

  useEffect(()  => {
    getDay()
  }, [])

  return (
    <Layout>
      <TopNav
        middleContent="Edit Workout"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        leftAction={() => navigation.goBack()}
        rightContent={
          <Ionicons
            name={isDarkmode ? "sunny" : "moon"}
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        rightAction={() => {
          if (isDarkmode) {
            setTheme("light");
          } else {
            setTheme("dark");
          }
        }}
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ExerciseCard selectedDay={day}/>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  card: {
      width: '90%',
      borderRadius: 3,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 1,
      flexDirection: 'column',
      flex: 1,
      padding: 10,
      position: 'absolute', top: 10
  }
})
