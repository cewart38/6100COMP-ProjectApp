import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, SafeAreaView, TextInput, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Dropdown } from 'react-native-material-dropdown';
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
import { ListItem } from "react-native-elements";
import { supabase } from "../initSupabase";
import { SelectList } from "react-native-dropdown-select-list";

type Workout = {
  workout_id: number;
  user_id: string;
  workout_name: string;
}

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "SelectDay">) {
  const { isDarkmode, setTheme } = useTheme();
  const [workouts, setWorkouts] = useState<Array<Workout>>([]);
  const [workout_name, setWorkoutName] = useState<string>("");
  const [restDay, setRestDay] = React.useState(false);
  const user = supabase.auth.user();
  const user_id = user?.id;
  const [selected, setSelected] = React.useState("")

  const level = [
    {key:'1', value:'Beginner'},
    {key:'2', value:'Intermediate'},
    {key:'3', value:'Advanced'}
  ]

  useEffect(()  => {
    fetchWorkouts();
  }, [])

  const addWorkout = async (workout_name: string) => {
      console.log('New Workout: ', workout_name)
      if(workout_name.length) {
        const { data: workout, error } = await supabase
        .from('workouts')
        .insert({ workout_name, user_id })
        .single()
      if (error) console.log(error.message)
      else {
        setWorkoutName('')
      } 
      }
  }

  const fetchWorkouts = async () => {
    const { data: workouts, error } = await supabase
    .from<Workout>('workouts')
    .select('*')
    .eq('user_id', user_id!)
    .order('workout_id', { ascending: false })
  if (error) console.log('error', error)
  else setWorkouts(workouts)
  }

  const deleteWorkout = async (workout_id: number) => {
    const { error } = await supabase.from<Workout>('workouts').delete().eq('workout_id', workout_id)
    if (error) console.log('error', error)
    else setWorkouts(workouts.filter((x) => x.workout_id !== Number(workout_id)))
  }


    const saveWorkoutId = async (workout_id: number) => {
      await AsyncStorage.removeItem('workoutID')
      const jsonValue = JSON.stringify(workout_id)
      await AsyncStorage.setItem('workoutID', jsonValue)
      }

      const showConfirmDialog = (workout_id:number) => {
        return Alert.alert(
          "Are you sure?",
          "Workout will be deleted",
          [
            {
              text: "Yes",
              onPress: () => {
                deleteWorkout(workout_id)
              },
            },
            {
              text: "No",
            },
          ]
        );
      };

  return (
    <Layout>
      <TopNav
        middleContent="Add Workout"
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
       <View style={styles.card}>
            <View style={styles.topRow}>
                <Text style={styles.topRowText}>New Workout</Text>
                {/* <Dropdown
                  label='Level'
                  data={level}
                /> */}
            </View>
            <View style={styles.secondRow}>
            <TextInput style={styles.exerciseTextInput}
              placeholder="Workout Name"
              value={workout_name}
              autoCapitalize='words'
              autoCorrect={true}
              keyboardType="default"
              onChangeText={(text) => setWorkoutName(text)}
            />
            </View>
            <View style={styles.bottomRow}>
            <Button
              text='Add Workout'
              onPress={() => {
                addWorkout(workout_name), fetchWorkouts()
              }}
              style={{
                marginTop: 0,
              }}
            />
            </View>
            </View>
            <View style={styles.workoutCard}>
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
                  <View style={styles.workout}>
                    <View style={styles.thirdRow}>
                  <Text>Workout: {workout.workout_name}</Text>
                  </View>
                  <View style={styles.workoutBottomRow}>
                  <Button
                      style={{ marginTop: 10 }}
                      text="Edit"
                      onPress={() => {
                        saveWorkoutId(workout.workout_id), navigation.navigate("SelectDay")
                      }}
            />
                <Button style={{marginTop: 10}}status='danger' text="Delete" onPress={() => showConfirmDialog(workout.workout_id)}></Button>
                  </View>
                </View>
                </View>
              </ListItem.Content>
            </ListItem>
          )}
        />
      </View>
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
    marginBottom: 30,
    marginTop: 10
  },
  workoutCard: {
    width: '90%',
    borderRadius: 3,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    flexDirection: 'row',
    flex: 4,
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
    justifyContent: 'space-between',
    flex: 2
  },
  workoutBottomRow: {
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
  workout: {
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
