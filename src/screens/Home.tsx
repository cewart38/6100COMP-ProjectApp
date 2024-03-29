import React, { useEffect, useState } from "react";
import { View, Linking, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, FlatList } from "react-native";
import { MainStackParamList } from "../types/navigation";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
  import { supabase } from "../initSupabase";
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
  themeColor,
  CheckBox,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { ListItem } from "react-native-elements";

type Workout = {
  workout_id: number;
  user_id: string;
  workout_name: string;
  active: boolean;
}

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const { isDarkmode, setTheme } = useTheme();
  const [workouts, setWorkouts] = useState<Array<Workout>>([]);
  const [textInput, setTextInput] = useState([])
  const user = supabase.auth.user();
  const user_id = user?.id;

    const fetchActiveWorkout = async () => {
      const { data: workouts, error } = await supabase
      .from<Workout>('workouts')
      .select('*')
      .eq('user_id', user_id!)
      .eq('active', true)
    if (error) console.log('error', error)
    else setWorkouts(workouts)
    }

    const saveWorkoutId = async (workout_id: number) => {
      await AsyncStorage.removeItem('workoutID')
      const jsonValue = JSON.stringify(workout_id)
      await AsyncStorage.setItem('workoutID', jsonValue)
      }

  useEffect(()  => {
    fetchActiveWorkout();
  }, [])

  return (
    <Layout>
      <TopNav
        middleContent="Home"
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
        <Section style={{ marginTop: 20, width: '90%', }}>
          <SectionContent>
            <Text fontWeight="bold" style={{ textAlign: "center" }}>
              Your Workout Plan
            </Text>
            <FlatList
          scrollEnabled={false}
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
                  <Text>{workout.workout_name}</Text>
                  </View>
                  <View style={styles.bottomRow}>
                  <Button text="Start Workout" onPress={() => {saveWorkoutId(workout.workout_id), navigation.navigate("StartWorkout")}}></Button>
                  </View>
                </View>
                </View>
              </ListItem.Content>
            </ListItem>
          )}
        />
            <Button
              style={{ marginTop: 10 }}
              text="Create and Edit Workouts"
              status="info"
              onPress={() => {
                navigation.navigate("AddWorkout");
              }}
            />
            <Button
              text="View Saved Workouts"
              status = 'info'
              onPress={() => {
                navigation.navigate("ViewSavedWorkouts");
              }}
              style={{
                marginTop: 10,
              }}
            />
          </SectionContent>
        </Section>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemText: {
    color: '#888',
    fontSize: 16,
  },
    card: {
        width: '349%',
        borderRadius: 3,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        flexDirection: 'column',
        flex: 1,
        padding: 10,
        marginBottom: 30,
        marginTop: 10
    },
    exerciseCard: {
      width: '90%',
      borderRadius: 3,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 1,
      flexDirection: 'row',
      flex: 2.5,
      padding: 10,
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
      flex: 1.3
    },
    thirdRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 30,
      flex: 1
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      flex: 2
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
