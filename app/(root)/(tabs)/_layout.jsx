import { Tabs } from 'expo-router';
import React, { useState } from 'react';

import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

export default function TabLayout() {

  const { colorScheme } = useColorScheme()

  return (

    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: colorScheme == 'dark' ? '#ccc' : 'gray',
        tabBarStyle: {
          height: 60,
          // paddingTop: 2,
          // paddingBottom: 2,
          backgroundColor: colorScheme == 'dark' ? '#020617' : '#fff',
          borderTopWidth: 0, // Ẩn đường viền tab
        },
        headerShown: false,
        tabBarItemStyle: {
          margin: 4, // Tạo khoảng cách giữa các tab
          paddingBottom: 4,
          borderRadius: 12, // Bo góc cho các tab
        },
        tabBarIconStyle: {
          width: 48,
          height: 48, // Đặt kích thước cho icon container
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: 'rgba(0, 0, 139, 0.1)', // Nền mờ mờ cho icon
          borderRadius: 12, // Bo góc container icon
        },
        tabBarActiveBackgroundColor: colorScheme == 'dark' ? '#6b6b6a' : 'rgba(0, 0, 139, 0.1)', // Nền mờ cho tab được chọn
        tabBarInactiveBackgroundColor: 'transparent', // Tab không được chọn có nền trong suốt
      }}>
      <Tabs.Screen
        name="training"
        options={{
          title: 'Training',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={24} name='fitness-center' color={color} />
          ),
          tabBarLabelStyle: {
            fontWeight: '900',
            fontSize: 11

          }
        }}
      />
      <Tabs.Screen
        name="custom"
        options={{
          title: 'Custom',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={24} name='edit' color={color} />
          ),
          tabBarLabelStyle: {
            fontWeight: '900',
            fontSize: 11

          }
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={24} name='weight-lifter' color={color} />
          ),
          tabBarLabelStyle: {
            fontWeight: '900',
            fontSize: 11
          },
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={24} name='google-analytics' color={color} />
          ),
          tabBarLabelStyle: {
            fontWeight: '900',
            fontSize: 11
          }
        }}

      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={24} name='article' color={color} />
          ),
          tabBarLabelStyle: {
            fontWeight: '900',
            fontSize: 11
          }
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Me',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name='person' color={color} />
          ),
          tabBarLabelStyle: {
            fontWeight: '900',
            fontSize: 11
          }
        }}
      />
    </Tabs>

  );
}
