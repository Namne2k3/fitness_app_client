
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useColorScheme } from "nativewind";
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Plan from "../Plan"
import TrainingContent from "../TrainingContent";

const Tab = createMaterialTopTabNavigator();

const TrainingPage = () => {
  const { colorScheme } = useColorScheme()
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
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: '#3749db',
            padding: 2,
            borderRadius: 12
          },
          tabBarActiveTintColor: colorScheme == 'dark' ? '#fff' : '#000',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {
            fontSize: 18,
            fontFamily: 'Roboto-Bold',
          },
          tabBarStyle: {
            shadowColor: '#fff',
            backgroundColor: colorScheme == 'dark' ? '#000' : '#f3f2f3'
          },
          swipeEnabled: false
        }}
      >
        <Tab.Screen name="KẾ HOẠCH" component={Plan} />
        <Tab.Screen name="LUYỆN TẬP" component={TrainingContent} />
      </Tab.Navigator>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TrainingPage