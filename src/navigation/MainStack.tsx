import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddWorkout from "../screens/AddWorkout";
import AddExercise from "../screens/AddExercise";
import MainTabs from "./MainTabs";
import SelectDay from "../screens/SelectDay";
import ViewExercises from "../screens/ViewExercises";
import ViewSelectDay from "../screens/ViewSelectDay";
import ViewSavedWorkouts from "../screens/ViewSavedWorkouts";
import StartWorkout from "../screens/StartWorkout";

const MainStack = createNativeStackNavigator();
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="AddWorkout" component={AddWorkout} />
      <MainStack.Screen name="AddExercise" component={AddExercise} />
      <MainStack.Screen name="ViewExercises" component={ViewExercises} />
      <MainStack.Screen name="ViewSelectDay" component={ViewSelectDay} />
      <MainStack.Screen name="SelectDay" component={SelectDay} />
      <MainStack.Screen name="ViewSavedWorkouts" component={ViewSavedWorkouts} />
      <MainStack.Screen name="StartWorkout" component={StartWorkout} />
    </MainStack.Navigator>
  );
};

export default Main;
