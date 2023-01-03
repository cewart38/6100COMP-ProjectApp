import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddWorkout from "../screens/AddWorkout";
import MainTabs from "./MainTabs";

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
    </MainStack.Navigator>
  );
};

export default Main;
