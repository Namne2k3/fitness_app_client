
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import Plan from "../../../components/Plan";
import TrainingContent from "../../../components/TrainingContent";

const Tab = createMaterialTopTabNavigator();

const TrainingPage = () => {
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
        <Tab.Screen name="KẾ HOẠCH" component={Plan} />
        <Tab.Screen name="LUYỆN TẬP" component={TrainingContent} />
      </Tab.Navigator>
    </SafeAreaView>

  )
}

export default TrainingPage