import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#ccc' : 'gray',
        tabBarStyle: {
          height: 60,
          backgroundColor: colorScheme === 'dark' ? '#020617' : '#fff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarItemStyle: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="training"
        options={{
          title: 'Kế hoạch',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons size={32} name='barbell' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="custom"
        options={{
          title: 'Tùy chỉnh',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={32} name='dashboard-customize' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Bài tập',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={32} name='weight-lifter' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Thống kê',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={32} name='google-analytics' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={32} name='article' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Me',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons size={32} name='person' color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
