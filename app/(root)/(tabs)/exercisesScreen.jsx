import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import Exercises from '../exercises';
import FoodScreen from '../foodScreen';
import { useSelector } from 'react-redux';
import { selectGetUser } from '../../../store/userReduxData/UserReduxSelectors';
const Tab = createMaterialTopTabNavigator();

const ExercisesScreen = () => {
    const user = useSelector(selectGetUser)
    console.log("check thu user from redux >>> ", user);

    const { colorScheme } = useColorScheme();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: insets.top,
                    backgroundColor: colorScheme === 'dark' ? '#000' : '#f3f2f3',
                },
            ]}
        >
            {/* Update StatusBar style */}
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Tab.Navigator
                screenOptions={{
                    tabBarIndicatorStyle: {
                        backgroundColor: '#3749db',
                        padding: 2,
                        borderRadius: 4,
                    },
                    tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
                    tabBarInactiveTintColor: 'gray',
                    tabBarLabelStyle: {
                        fontSize: 18,
                        fontFamily: 'Roboto-Bold',
                    },
                    tabBarStyle: {
                        shadowColor: '#fff',
                        backgroundColor: colorScheme === 'dark' ? '#000' : '#f3f2f3',
                    },
                    swipeEnabled: false,
                }}
            >
                <Tab.Screen name="BÀI TẬP" component={Exercises} />
                <Tab.Screen name="THỰC PHẨM" component={FoodScreen} />
            </Tab.Navigator>
        </View>
    );
};

export default ExercisesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
