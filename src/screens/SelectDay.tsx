import React, { useState } from "react";
import { View, Linking, TouchableOpacity, StyleSheet, SectionList, FlatList } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
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
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { ListItem } from "react-native-elements";

const DATA = [
    {
      day: 'Monday'
    },
    {
      day: 'Tuesday'
    },
    {
      day: 'Wednesday'
    },
    {
      day: 'Thursday'
    },
    {
      day: 'Friday'
    },
    {
      day: 'Saturday'
    },
    {
      day: 'Sunday'
    }
]

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "AddExercise">) {
  const { isDarkmode, setTheme } = useTheme();

  const saveDay = async (day: string) => {
      await AsyncStorage.removeItem('day')
      await AsyncStorage.setItem('day', day) 
  }

  return (
    <Layout>
      <TopNav
        middleContent="Select Day"
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
            <View>
          <FlatList
          scrollEnabled={true}
          data={DATA}
          keyExtractor={(item) => `${item.day}`}
          renderItem={({ item: day }) => (
            <ListItem>
              <ListItem.Content>
                <View
                  style={[
                    { display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' },
                  ]}
                >
                  <View style={styles.item}>
                    <View style={styles.thirdRow}>
                  <Text>{day.day}</Text>
                  <Button style={{}}status='info' text="Edit" onPress={() => {saveDay(day.day), navigation.navigate('AddExercise')}}></Button>
                  </View>
                </View>
                </View>
              </ListItem.Content>
            </ListItem>
          )}
        />
        </View>
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
    width: '90%',
    borderRadius: 3,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    flexDirection: 'column',
    padding: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1
},
thirdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 30,
    flex: 1
  }
});
