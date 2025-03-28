import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme == 'dark' ? '#fff' : '#3749db',
        // tabBarInactiveTintColor: colorScheme === 'dark' ? '#ccc' : 'gray',
        tabBarStyle: {
          height: 60,
          backgroundColor: colorScheme === 'dark' ? '#020617' : '#fff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: "#fff"
        },
        tabBarItemStyle: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="training"
        options={{
          title: 'Luyện tập',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name='home' color={color} />
            // <FontAwesome6 size={24} name='dumbbell' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="exercisesScreen"
        options={{
          title: 'Tìm kiếm',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={26} name='space-dashboard' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="custom"
        options={{
          title: 'Tùy chỉnh',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={22} name='pen' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Thống kê',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={26} name='google-analytics' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Bảng tin',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={26} name='article' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Tôi',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons size={26} name='person' color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
