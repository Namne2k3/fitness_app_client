import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { Stack } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { useColorScheme } from 'nativewind'

const RootLayout = () => {

    const { colorScheme } = useColorScheme()

    return (
        <>
            <Stack>
                <Stack.Screen
                    name='(tabs)'
                    options={{
                        headerShown: false,
                        headerStyle: {
                            backgroundColor: colorScheme == 'dark' && 'rgb(2 6 23)'
                        }
                    }}
                />
                <Stack.Screen
                    name='index'
                    options={{
                        headerShown: false,
                        title: "welcome",
                        headerStyle: {
                            backgroundColor: colorScheme == 'dark' && 'rgb(2 6 23)'
                        }
                    }}
                />
                <Stack.Screen
                    name='onboarding'
                    options={{
                        headerShown: false,
                        title: "",
                        headerStyle: {
                            backgroundColor: colorScheme == 'dark' && 'rgb(2 6 23)'
                        }
                    }}
                />
                <Stack.Screen
                    name='createexercisepage'
                    options={{
                        headerShown: false,
                        headerTitle: "",
                        headerRight: () => (
                            <View>
                                <TouchableOpacity
                                    onPress={() => { }}
                                    className="flex flex-row p-2 bg-[#eaecef] rounded-lg justify-center items-center"
                                >
                                    <Text className="font-psemibold text-lg">New Training</Text>
                                    <View className="flex justify-center items-center ml-2">
                                        <Feather name='edit-3' size={24} />

                                    </View>
                                </TouchableOpacity>
                            </View>
                        ),
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: colorScheme == 'dark' && 'rgb(2 6 23)'
                        }
                    }}
                />
                <Stack.Screen
                    name='TrainingDetails/[id]'
                    options={{
                        headerShown: false,
                        headerTitle: "",
                        headerShadowVisible: false,
                        headerStyle: {
                            backgroundColor: '#00008B',
                        }
                    }}
                />
                <Stack.Screen
                    name='editCustomTraining/[id]'
                    options={{
                        headerShown: false,
                        headerTitle: "",
                        headerShadowVisible: false,
                        headerTintColor: colorScheme == 'dark' && "#fff"
                    }}
                />
                <Stack.Screen
                    name='bodypartexercises/[name]'
                    options={{
                        headerShown: true,
                        headerTitle: "",
                        headerShadowVisible: false,
                        headerTintColor: colorScheme == 'dark' && "#fff",
                        headerStyle: {
                            backgroundColor: colorScheme == 'dark' && '#020617'
                        }
                    }}
                />
                <Stack.Screen
                    name='beginTraining/[id]'
                    options={{
                        headerShown: false,
                        headerTitle: '',
                        headerShadowVisible: false,
                        headerTintColor: colorScheme == 'dark' && "#fff"
                    }}
                />
                <Stack.Screen
                    name='feed/[_id]'
                    options={{
                        headerShown: true,
                        headerTitle: '',
                        headerShadowVisible: false,
                        headerTintColor: colorScheme == 'dark' && "#fff"
                    }}
                />
                <Stack.Screen
                    name='myprofile'
                    options={{
                        headerShown: false,
                        headerTitle: '',
                        headerShadowVisible: false,
                        headerTintColor: colorScheme == 'dark' && "#fff"
                    }}
                />
                <Stack.Screen
                    name='newfeedpage'
                    options={{
                        headerShown: true,
                        headerTitle: '',
                        headerShadowVisible: false,
                        headerTintColor: colorScheme == 'dark' && "#fff"
                    }}
                />
                <Stack.Screen
                    name='ForgotPasswordPage'
                    options={{
                        headerShown: false,
                        headerTitle: '',
                        headerShadowVisible: false,
                        headerTintColor: colorScheme == 'dark' && "#fff"
                    }}
                />
                <Stack.Screen
                    name='RecoveryPasswordPage/[email]'
                    options={{
                        headerShown: false,
                        headerTitle: '',
                        headerShadowVisible: false,
                        headerTintColor: colorScheme == 'dark' && "#fff"
                    }}
                />
                <Stack.Screen
                    name='update1rm'
                    options={{
                        headerShown: false,
                        headerTitle: 'My 1RM',
                        headerShadowVisible: false,
                        headerTintColor: colorScheme == 'dark' && "#fff"
                    }}
                />
                <Stack.Screen
                    name='finishTraining/[id]'
                    options={{
                        headerShown: false,
                        headerTitle: '',
                        headerShadowVisible: false,
                        headerTintColor: colorScheme == 'dark' && "#fff"
                    }}
                />
                <Stack.Screen
                    name='GeneralSettings'
                    options={{
                        headerShown: false,
                        headerTitleStyle: {
                            fontWeight: '1000'
                        },
                        headerShadowVisible: false,
                        headerTintColor: colorScheme == 'dark' && "#fff"
                    }}
                />
                <Stack.Screen
                    name='allHistoryRecords'
                    options={{
                        headerShown: false,
                        headerTitle: '',
                        headerShadowVisible: false,
                        headerTintColor: colorScheme == 'dark' && "#fff"
                    }}
                />
                <Stack.Screen
                    name='FeedBack'
                    options={{
                        headerShown: false,
                        headerTitle: 'Feedback',
                        headerShadowVisible: false,
                        headerTitleStyle: {
                            fontWeight: '900'
                        },
                        headerTintColor: colorScheme == 'dark' && "#fff"
                    }}
                />
                <Stack.Screen
                    name='FillInformation/[email]'
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
        </>
    )
}

export default RootLayout

const styles = StyleSheet.create({})