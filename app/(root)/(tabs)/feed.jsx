import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind'
import { seedBlogs } from '../../../constants/seeds'
import { images } from '../../../constants/image'
import BlogCard from '../../../components/BlogCard';
const Feed = () => {
    const { colorScheme } = useColorScheme()

    return (
        <SafeAreaView className="flex bg-[#fff] h-full pt-4 dark:bg-slate-950">
            <View className="flex flex-row justify-between items-center px-4">
                <View className="">
                    <AntDesign disabled name='plus' size={26} color={colorScheme == 'dark' ? '#000' : '#fff'} />
                </View>
                <Text className="dark:text-white font-pextrabold text-[32px] text-center">Feed</Text>
                <TouchableOpacity className="mb-1" onPress={() => { }}>
                    <AntDesign name='plus' size={26} color={colorScheme == 'dark' ? '#fff' : '#000'} />
                </TouchableOpacity>
            </View>

            <View className="flex justify-center items-center">
                <FlatList
                    data={seedBlogs}
                    renderItem={({ item }) => {
                        return (
                            <BlogCard blog={item} />
                        )
                    }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View className="flex flex-col items-center justify-center bg-transparent">
                            <Image
                                source={images.no_result}
                                className="w-40 h-40"
                                alt="No recent rides found"
                                resizeMethod="contain"
                            />
                            <Text className="text-sm">No exercises found!</Text>
                        </View>
                    )}
                    contentContainerStyle={{
                        paddingBottom: 100
                    }}
                />
            </View>
        </SafeAreaView>
    )
}

export default Feed
