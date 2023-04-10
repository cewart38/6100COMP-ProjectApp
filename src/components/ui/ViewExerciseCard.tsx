import { StyleSheet, View, TextInput, FlatList, SafeAreaView, ScrollView } from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

type Exercise = {
  exercise_id: number;
  workout_id: number;
  name: string;
  sets: string;
  reps: string;
  day: string;
}

export const ViewExerciseCard = ({selectedDay}) => {

  const [exercises, setExercises] = useState<Array<Exercise>>([]);
  const [name, setName] = useState<string>("");
  const [sets, setSets] = useState<string>("");   
  const [reps, setReps] = useState<string>("");
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


  const fetchExercises = async () => {
    const workout_id = await getWorkout();
    const day = await getDay();
    console.log('ID: ', workout_id)
    console.log('Day: ', day)
    const { data: exercises, error } = await supabase
    .from<Exercise>('exercises')
    .select('*')
    .eq('workout_id', workout_id!)
    .eq('day', day!)
    .order('exercise_id', { ascending: true })
  if (error) console.log('error', error)
  else setExercises(exercises)
  }


    return (
        <View style={styles.container}>
        <SafeAreaView style={styles.verticallySpaced}>
        <FlatList style={styles.list}
          scrollEnabled={true}
          data={exercises}
          keyExtractor={(item) => `${item.exercise_id}`}
          renderItem={({ item: exercise }) => (
            <ListItem bottomDivider>
              <ListItem.Content>
                <View
                  style={[
                    { display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'},
                  ]}
                >
                  <View style={styles.exercise}>
                    <View style={styles.thirdRow}>
                  <Text>Exercise: {exercise.name}</Text>
                  </View>
                  <View style={styles.bottomRow}>
                  <Text>Sets: {exercise.sets}</Text>
                  <Text>Reps: {exercise.reps}</Text>
                  </View>
                </View>
                </View>
              </ListItem.Content>
            </ListItem>
          )}
        />
      </SafeAreaView>
        </View>
        
    )
}


const styles = StyleSheet.create({
    container: {
        width: '90%',
        flexDirection: 'column',
        padding: 10,
    },
    list: {
        backgroundColor: '#fff'
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 20
    },
    topRowText: {
        fontSize: 16
    },
    secondRow: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingBottom: 30
    },
    thirdRow: {
      flexDirection: 'row',
      alignContent: 'center',
      paddingBottom: 30
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch'
  },
  exercise: {
    width: '100%',
    borderRadius: 3,
    backgroundColor: '#e6e6e6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    flexDirection: 'column',
    padding: 10
  }
})