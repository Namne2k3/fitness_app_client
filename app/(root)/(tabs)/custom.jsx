import { images } from '@/constants/image';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomTrainingCard from '../../../components/CustomTrainingCard';
import { fetchTrainingsByUserId } from '../../../libs/mongodb';
import { useUserStore } from '../../../store';
import { useSelector } from 'react-redux';
import { selectGetUser } from '@/store/userReduxData/UserReduxSelectors';

const CustomPage = () => {
  const [refreshing, setRefreshing] = useState(false);

  const [trainingDatas, setTrainingDatas] = useState([]);

  const [isLoading, setIsLoading] = useState(true); // Sử dụng isLoading để kiểm tra trạng thái loading

  // const user = useUserStore((state) => state.user)
  const user = useSelector(selectGetUser)
  console.log("Check user >>> ", user);


  const { colorScheme } = useColorScheme()

  const handleFetchTrainingsByUserId = async () => {
    try {
      const data = await fetchTrainingsByUserId(user?._id);
      setTrainingDatas(data);
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleFetchTrainingsByUserId();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  useFocusEffect(
    useCallback(() => {
      handleFetchTrainingsByUserId();
    }, [])
  );

  return (
    <SafeAreaView className="flex bg-[#f3f2f3] h-full px-4 pt-4 dark:bg-slate-950">
      <View className="flex flex-row justify-between items-center mb-4">
        <Text className="dark:text-white font-pextrabold text-[32px] uppercase">tùy chỉnh</Text>
        <View className="flex flex-row">
          <TouchableOpacity className='' onPress={() => router.push({
            pathname: '/(root)/CalendarScreen',
            params: {
              data: JSON.stringify(trainingDatas)
            }
          })}>
            <Ionicons name='calendar-outline' size={32} color={colorScheme == 'dark' ? '#fff' : '#000'} />
          </TouchableOpacity>
          <TouchableOpacity className='ml-2' onPress={() => router.push('/(root)/createexercisepage')}>
            <AntDesign name='pluscircleo' size={32} color={colorScheme == 'dark' ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View className="h-full flex justify-center items-center">
          <ActivityIndicator color={colorScheme == 'dark' ? '#fff' : '#000'} size={'large'} />
        </View>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerStyle={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '50%'
              }}
            >
              <View className="flex justify-center items-center">
                <Text className="font-psemibold text-lg">Chưa có bài tập tùy chỉnh nào được tạo</Text>
                <View>
                  <Image
                    source={images.no_result}
                    className="w-[300px] h-[300px]"
                    resizeMode='contain'
                  />
                </View>
              </View>
            </ScrollView>
          )}
          data={trainingDatas}
          renderItem={({ item }) => (
            <CustomTrainingCard item={item} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default CustomPage;