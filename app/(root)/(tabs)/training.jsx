
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TrainingContent from "../../../components/TrainingContent";
import Plan from "../../../components/Plan";
import { useColorScheme } from "nativewind";

const Tab = createMaterialTopTabNavigator();

const TrainingPage = () => {

  const { colorScheme } = useColorScheme()
  return (

    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {
          backgroundColor: '#00008B',
          padding: 3,
          borderRadius: 4,
        },
        tabBarActiveTintColor: colorScheme == 'dark' ? '#fff' : '#000',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 16,
          alignSelf: 'center',
          fontFamily: 'Roboto-Bold',
          marginTop: 32
        },
        tabBarStyle: {
          display: 'flex',
          backgroundColor: '#fff',
          shadowColor: '#fff',
        },
        tabBarContentContainerStyle: {
          backgroundColor: colorScheme == 'dark' ? 'rgb(2 6 23)' : '#fff'
        }
      }}
    >
      <Tab.Screen name="LỘ TRÌNH" component={Plan} />
      <Tab.Screen name="BÀI TẬP" component={TrainingContent} />
    </Tab.Navigator>

  )
}

export default TrainingPage