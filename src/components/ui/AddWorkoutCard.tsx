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
import { MainStackParamList } from "../../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Input, ListItem } from 'react-native-elements'
import React, { useEffect, useState } from "react";
import { supabase } from '../../initSupabase';
import { useUser } from '../../provider/UserContext';
import navigation from '../../navigation';

type Workout = {
  workout_id: number;
  user_id: string;
  workout_name: string;
}


export const AddWorkoutCard = ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) => {

    const [workouts, setWorkouts] = useState<Array<Workout>>([]);
    const [workout_name, setWorkoutName] = useState<string>("");
    //const { user } = useUser();
    const [restDay, setRestDay] = React.useState(false);
    const user = supabase.auth.user();
    const user_id = user?.id;
    console.log(user_id);

    useEffect(()  => {
      fetchWorkouts()
    }, [])

    const addWorkout = async (workout_name: string) => {
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
      .order('workout_id', { ascending: false })
    if (error) console.log('error', error)
    else setWorkouts(workouts)
    }

    const deleteWorkout = async (workout_id: number) => {
      const { error } = await supabase.from<Workout>('workouts').delete().eq('workout_id', workout_id)
      if (error) console.log('error', error)
      else setWorkouts(workouts.filter((x) => x.workout_id !== Number(workout_id)))
    }

    return (
      <SafeAreaView style={{flex:1}}>
        <View style={styles.card}>
            <View style={styles.topRow}>
                <Text style={styles.topRowText}>New Workout</Text>
            </View>
            <View style={styles.secondRow}>
            <TextInput style={styles.exerciseTextInput}
              placeholder="Workout Name"
              value={workout_name}
              autoCapitalize='words'
              autoCorrect={false}
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
            <View style={styles.exerciseCard}>
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
                  </View>
                  <View style={styles.bottomRow}>
                  <Button status='danger' text="Delete" onPress={() => deleteWorkout(workout.workout_id)}></Button>
                  <Button
                      style={{ marginTop: 10 }}
                      text="Edit"
                      status="info"
                      onPress={() => {
                        navigation.navigate("AddExercise");
                      }}
            />
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
      justifyContent: 'flex-end',
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