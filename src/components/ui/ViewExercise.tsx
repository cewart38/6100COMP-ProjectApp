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

type Exercise = {
  exercise_id: number;
  name: string;
  sets: string;
  reps: string;
}


export const ViewExercise = () => {

    const [exercises, setExercises] = useState<Array<Exercise>>([]);

    useEffect(()  => {
      fetchExercises();
    }, [])


    const fetchExercises = async () => {
      const { data: exercises, error } = await supabase
      .from<Exercise>('exercises')
      .select('*')
      .order('exercise_id', { ascending: false })
    if (error) console.log('error', error)
    else setExercises(exercises)
    }

    const deleteExercise = async (exercise_id: number) => {
      const { error } = await supabase.from<Exercise>('exercises').delete().eq('exercise_id', exercise_id)
      if (error) console.log('error', error)
      else setExercises(exercises.filter((x) => x.exercise_id !== Number(exercise_id)))
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
                  <Text>Sets: {exercise.sets}</Text>
                  <Text>Reps: {exercise.reps}</Text>
                  </View>
                  <View style={styles.bottomRow}>
                  <Button status='danger' text="Delete" onPress={() => deleteExercise(exercise.exercise_id)}></Button>
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
        position: 'absolute', bottom: 100
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
      justifyContent: 'space-between',
      paddingBottom: 30
    },
    bottomRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
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