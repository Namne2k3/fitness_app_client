import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import Exercises from '../exercises'
import FoodScreen from '../foodScreen'

const Tab = createMaterialTopTabNavigator();

const ExercisesScreen = () => {

    const { colorScheme } = useColorScheme()

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
            <Tab.Navigator
                screenOptions={{
                    tabBarIndicatorStyle: {
                        backgroundColor: '#3749db',
                        padding: 2,
                        borderRadius: 4
                    },
                    tabBarActiveTintColor: colorScheme == 'dark' ? '#fff' : '#000',
                    tabBarInactiveTintColor: 'gray',
                    tabBarLabelStyle: {
                        fontSize: 18,
                        fontFamily: 'Roboto-Bold',
                    },
                    tabBarStyle: {
                        shadowColor: '#fff',
                        backgroundColor: '#f3f2f3'
                    },
                    swipeEnabled: false
                }}
            >
                <Tab.Screen name="BÀI TẬP" component={Exercises} />
                <Tab.Screen name="THỰC PHẨM" component={FoodScreen} />
            </Tab.Navigator>
        </SafeAreaView>
    )
}

export default ExercisesScreen

const styles = StyleSheet.create({})