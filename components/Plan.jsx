import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Plan = () => {
    return (
        <SafeAreaView className="dark:bg-slate-950 h-full">
            <Text className="dark:text-white">Plan (from DB)</Text>
        </SafeAreaView>
    )
}

export default Plan