import { StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
const AuthLayout = () => {
    const { colorScheme } = useColorScheme()
    return (
        <>
            <StatusBar style={colorScheme == 'dark' ? 'dark' : 'light'} />
            <Stack>
                <Stack.Screen
                    name='sign-in'
                    options={{
                        headerShown: true,
                        headerTitle: '',
                        headerShadowVisible: false
                    }}
                />
                <Stack.Screen
                    name='sign-up'
                    options={{
                        headerShown: true,
                        headerTitle: '',
                        headerShadowVisible: false
                    }}
                />

            </Stack>
        </>
    )
}

export default AuthLayout

const styles = StyleSheet.create({})