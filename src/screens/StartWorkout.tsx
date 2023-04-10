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
import moment from "moment";

type Exercise = {
    exercise_id: number;
    workout_id: number;
    name: string;
    sets: string;
    reps: string;
    day: string;
  }

  type CompletedExercise = {
    exercise_id: number;
    workout_id: number;
    user_id: string;
    weight: number;
    date: Date;
  }

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const { isDarkmode, setTheme } = useTheme();
  const [exercises, setExercises] = useState<Array<Exercise>>([]);
  const [ weight, setWeight ] = useState<string>("");
  const user = supabase.auth.user();
  const user_id = user?.id;
  const day = moment().format('dddd')
  const displayDate = moment().format("MMM Do YYYY");  
  const date = moment().format('DD,MM,YYYY');
  

    const fetchExercises= async () => {
      const workout_id = await getWorkout();
      const { data: exercises, error } = await supabase
      .from<Exercise>('exercises')
      .select('*')
      .eq('workout_id', workout_id!)
      .eq('day', day) 
    if (error) console.log('error', error)
    else setExercises(exercises)
    }

    const getWorkout = async () => {
        try {
          const workoutId = await AsyncStorage.getItem('workoutID')
          if(workoutId !== null) {
            const workoutIdNo = parseInt(workoutId);
            console.log('WorkoutId', workoutId)
            return workoutIdNo;
          }
        } catch (e) {
          console.log('Could not retrieve value')
        }
      }

      const saveExercise = async (exercise_id: number) => {
        const workout_id = await getWorkout()
        if(exercise_id) {
          const { data: completedExercise, error } = await supabase
          .from('completed_exercises')
          .insert({ exercise_id, user_id, workout_id, date, weight })
          .single()
        if (error) console.log(error.message)
        else {
          setWeight('')
        } 
        }
    }

  useEffect(()  => {
    fetchExercises();
  }, [])

  return (
    <Layout>
      <TopNav
        middleContent="Workout"
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
        <Section style={{ marginTop: 20, width: '90%', }}>
          <SectionContent>
            <Text fontWeight="bold" style={{ textAlign: "center" }}>
               {displayDate}
            </Text>
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
                  <View style={styles.item}>
                    <View style={styles.thirdRow}>
                  <Text>{exercise.name}</Text>
                  <Text>Sets: {exercise.sets}</Text>
                  <Text>Reps: {exercise.reps}</Text>
                  </View>
                  <View style={styles.bottomRow}>
                  <Text>Weight (kg)</Text>
                  <TextInput style={styles.textInput}
              value={weight}
              autoCorrect={false}
              keyboardType="numeric" 
              onChangeText={(text) => exercise[index]}
            />
                  <Button text="Save" onPress={() => saveExercise(exercise.exercise_id)}></Button>
                  </View>
                </View>
                </View>
              </ListItem.Content>
            </ListItem>
          )}
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
    borderBottomWidth: 1
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
      justifyContent: 'space-between',
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
    height: '70%',
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
