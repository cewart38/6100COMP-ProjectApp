import { StyleSheet, View, TextInput, FlatList, SafeAreaView, ScrollView, Alert } from 'react-native';
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
import { Input, ListItem } from 'react-native-elements'
import React, { useEffect, useState } from "react";
import { supabase } from '../../initSupabase';
import day from 'react-native-calendars/src/calendar/day';
import getWorkoutId from '../../screens/AddWorkout'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Collapsible from 'react-native-collapsible';

type Exercise = {
  exercise_id: number;
  workout_id: number;
  name: string;
  sets: string;
  reps: string;
  day: string;
}


export const ExerciseCard = ( {selectedDay} ) => {

  const initialState = {
    restDay: false, 
  };

    const [exercises, setExercises] = useState<Array<Exercise>>([]);
    const [name, setName] = useState<string>("");
    const [sets, setSets] = useState<string>("");   
    const [reps, setReps] = useState<string>("");
    const [state, setState] = React.useState(initialState);
    const [day, setDay] = useState<string>("");
    const [workout_id, setWorkout_id] = useState<number>()
    const [restDay, setRestDay] = React.useState(false);

    const getWorkout = async () => {
      try {
        const workoutId = await AsyncStorage.getItem('workoutID')
        if(workoutId !== null) {
          const workoutIdNo = parseInt(workoutId);
          return workoutIdNo;
        }
      } catch (e) {
        console.log('Could not retrieve value')
      }
    }

    const getDay = async () => {
      try {
        const day = await AsyncStorage.getItem('day')
        if(day !== null) {
          return day;
        }
      } catch (e) {
        console.log('Could not retrieve value')
      }
    }

    useEffect(()  => {
      fetchExercises();
    }, []);

    const  addExercise = async (name: string, sets: string, reps: string) => {
      const workout_id = await getWorkout();
      const day = await getDay();
        if(name.length) {
          const { data: exercise, error } = await supabase
          .from('exercises')
          .insert({ name, sets, reps, day, workout_id })
          .single()
        if (error) console.log(error.message)
        else {
          setName('')
          setReps('')
          setSets('')
        } 
        }
    }

    const fetchExercises = async () => {
      const workout_id = await getWorkout();
      const day = await getDay();
      const { data: exercises, error } = await supabase
      .from<Exercise>('exercises')
      .select('*')
      .eq('workout_id', workout_id!)
      .eq('day', day!)
      .order('exercise_id', { ascending: true })
    if (error) console.log('error', error)
    else setExercises(exercises)
    }

    const deleteExercise = async (exercise_id: number) => {
      const { error } = await supabase.from<Exercise>('exercises').delete().eq('exercise_id', exercise_id)
      if (error) console.log('error', error)
      else setExercises(exercises.filter((x) => x.exercise_id !== Number(exercise_id)))
    }

    const showConfirmDialog = (exercise_id:number) => {
      return Alert.alert(
        "Are you sure?",
        "Exercise will be deleted",
        [
          {
            text: "Yes",
            onPress: () => {
              deleteExercise(exercise_id)
            },
          },
          {
            text: "No",
          },
        ]
      );
    };


    return (
      <SafeAreaView style={{flex:1}}>
        <View style={styles.card}>
            <View style={styles.topRow}>
                <Text style={styles.topRowText}>{selectedDay}</Text>
                <CheckBox
              value={state.restDay}
              onValueChange={value =>
                setState({
                  ...state,
                  restDay: value,
                })
              }
            />
            </View>
            <View style={styles.secondRow}>
            <TextInput style={styles.exerciseTextInput}
              placeholder="Exercise Name"
              value={name}
              autoCapitalize='words'
              autoCorrect={true}
              keyboardType="default"
              onChangeText={(text) => setName(text)}
            />
            </View>
            <View style={styles.thirdRow}>
            <Text>
              Sets
            </Text>
            <TextInput style={styles.textInput}
              value={sets}
              autoCorrect={false}
              keyboardType="numeric"
              onChangeText={(text) => setSets(text)}
            />
            <Text>
              Reps
            </Text>
            <TextInput style={styles.textInput}
              value={reps}
              autoCorrect={false}
              keyboardType="numeric"
              onChangeText={(text) => setReps(text)}
            />
            </View>
            <View style={styles.bottomRow}>
            <Button
              text='Add Exercise'
              onPress={() => {
                addExercise(name, sets, reps), fetchExercises()
              }}
              style={{
                marginTop: 0,
              }}
            />
            </View>
            </View>
            <View style={styles.exerciseCard}>
        <FlatList
          scrollEnabled={true}
          data={exercises}
          keyExtractor={(item) => `${item.exercise_id}`}
          renderItem={({ item: exercise }) => (
            <ListItem>
              <ListItem.Content>
                <View
                  style={[
                    { display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' },
                  ]}
                >
                  <View style={styles.exercise}>
                    <View style={styles.thirdRow}>
                  <Text>{exercise.name}</Text>
                  <Text>Sets: {exercise.sets}</Text>
                  <Text>Reps: {exercise.reps}</Text>
                  </View>
                  <View style={styles.bottomRow}>
                  <Button status='danger' text="Delete" onPress={() => showConfirmDialog(exercise.exercise_id)}></Button>
                  </View>
                </View>
                </View>
              </ListItem.Content>
            </ListItem>
          )}
        />
      </View>
      </SafeAreaView>
        
    )
}


const styles = StyleSheet.create({
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