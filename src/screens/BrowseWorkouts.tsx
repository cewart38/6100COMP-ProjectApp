import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, TextInput, View, StyleSheet } from "react-native";
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
import { supabase } from "../initSupabase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import { ListItem } from "react-native-elements";

type Exercise = {
  exercise_id: number;
  workout_id: number;
  name: string;
  sets: string;
  reps: string;
  day: string;
}

type Workout = {
  profiles: any;
  workout_id: number;
  user_id: string;
  workout_name: string;
  username: string;
}

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {

  const [workouts, setWorkouts] = useState<Array<Workout>>([]);
  const { isDarkmode, setTheme } = useTheme();
  const user = supabase.auth.user();
  const user_id = user?.id;

  const fetchWorkouts = async () => {
    const { data: workouts, error } = await supabase
    .from<Workout>('workouts')
    .select('*, profiles (username)')
    .neq('user_id', user_id)
    .order('workout_id', { ascending: false })
  if (error) console.log('error', error)
  else setWorkouts(workouts)
  }


  const saveWorkoutId = async (workout_id: number) => {
    console.log(workout_id);
    await AsyncStorage.removeItem('workoutID')
    const jsonValue = JSON.stringify(workout_id)
    await AsyncStorage.setItem('workoutID', jsonValue)
    }

const saveWorkout = async (workout_id: number) => {
    if (workout_id) {
      const { data: error }  = await supabase
      .from('saved_workouts')
      .insert({ workout_id, user_id })
      .single()
    if (error) console.log(error.message)
  }
}

  useEffect(()  => {
    fetchWorkouts();
  }, []);

    return (
      <Layout>
        <TopNav
          middleContent="User's Workouts"
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
          <SafeAreaView style={styles.verticallySpaced}>
          <FlatList
            scrollEnabled={true}
            data={workouts}
            keyExtractor={(item) => `${item.workout_id}`}
            renderItem={({ item: workout }) => (
              <ListItem>
                <ListItem.Content>
                  <View
                    style={[
                      { display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' },
                    ]}
                  >
                    <View style={styles.exercise}>
                      <View style={styles.thirdRow}>
                    <Text>Workout: {workout.workout_name}</Text>
                    <Text>Created By: {workout.profiles.username}</Text>
                    </View>
                    <View style={styles.bottomRow}>
                    <Button
                        style={{ marginTop: 10 }}
                        text="View"
                        onPress={() => {
                          saveWorkoutId(workout.workout_id), navigation.navigate("ViewSelectDay")
                        }}
              />
                                  <Button
                        style={{ marginTop: 10 }}
                        text="Add Workout"
                        onPress={() => {
                          saveWorkout(workout.workout_id);
                          alert("Workout Saved!");
                        }}
              />
                    </View>
                  </View>
                  </View>
                </ListItem.Content>
              </ListItem>
            )}
          />
        </SafeAreaView>
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
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 20,
        flex: 1
    },
    topRowText: {
        fontSize: 16
    },
    secondRow: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingBottom: 30,
      flex: 1
    },
    thirdRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 30,
      flex: 1
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flex: 1
    },
    exerciseTextInput: {
    marginTop: 5,
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    fontSize: 20
    },
    textInput: {
    marginTop: 5,
    width: '10%',
    height: '150%',
    backgroundColor: '#e6e6e6'
    },
    verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
    flexGrow: 1
    },
    exercise: {
    width: '100%',
    borderRadius: 3,
    backgroundColor: '#e6e6e6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    flexDirection: 'column',
    padding: 10,
    flex: 1
  }
  })
  