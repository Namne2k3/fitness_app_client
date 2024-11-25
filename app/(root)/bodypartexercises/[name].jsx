import { router, useLocalSearchParams } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import BottomSheetModalComponent from '../../../components/BottomSheetModal'
import ExerciseDetailCard from '../../../components/ExerciseDetailCard'
import { images } from '../../../constants/image'
import { fetchAllExercisesByBodyPart } from '../../../libs/exerciseDb'
import { getAllExercisesByBodyPart } from '../../../libs/mongodb'
import { Feather, Ionicons } from '@expo/vector-icons'

const ListHeaderComponent = ({ name }) => {

  return (
    <View className="flex flex-row justify-between items-center mb-4">
      <View>
        <Text className="dark:text-white font-pextrabold text-[32px] uppercase">{name}</Text>
      </View>
      <View className="">
        <Image
          source={images[name]}
          className="w-[100px] h-[100px] rounded-full"
          contentFit='cover'
        />
      </View>
    </View>
  )
}
const BodyPartExercisesDetails = () => {

  const { name } = useLocalSearchParams()

  const [isLoading, setIsLoading] = useState(false)
  const [smallLoading, setSmallLoading] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState({})
  const { colorScheme } = useColorScheme()
  const [exercisesBodyParts, setExercisesBodyParts] = useState([])
  const bottomSheetRef = useRef(null)
  const [skip, setSkip] = useState(0)
  const limit = 10

  const handlePresentModalSheet = useCallback((item) => {
    bottomSheetRef.current?.present()
    setSelectedExercise(item)

  })

  const fetchDataByQuery = async (isSearchReset = false) => {
    try {
      if (isSearchReset) {
        setIsLoading(true);
        setSkip(0);
        setExercisesBodyParts([]);
      } else {
        setSmallLoading(true)
      }

      const res = await getAllExercisesByBodyPart(name || "", { limit, skip: isSearchReset ? 0 : skip });
      if (res.status === '404') {
        console.log("Gặp lỗi 404");
        return;
      }

      const newExercises = res.data;
      setExercisesBodyParts((prevExercises) => isSearchReset ? newExercises : [...prevExercises, ...newExercises]);

      if (newExercises.length > 0) {
        setSkip((prevSkip) => prevSkip + limit);
      }
    } catch (error) {
      console.log("Error fetching training data:", error);
    } finally {
      setSmallLoading(false)
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchDataByQuery(true)
  }, [])

  return (
    <SafeAreaView className="bg-[#fff] h-full p-4 dark:bg-slate-950">
      <View className="flex flex-row justify-start items-center pb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: 'transparent'
          }}
        >
          <Feather name='arrow-left' size={24} color={colorScheme == 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={exercisesBodyParts}
        ListHeaderComponent={() => <ListHeaderComponent name={name} />}
        renderItem={({ item }) => <ExerciseDetailCard handlePresentModalSheet={handlePresentModalSheet} exercise={item} />}
        ItemSeparatorComponent={() =>
          <View className="h-[16px] bg-[#fff] dark:bg-slate-950" />
        }
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          !smallLoading ?
            <TouchableOpacity className='p-4 flex flex-row justify-center items-center' onPress={() => fetchDataByQuery(false)}>
              <Ionicons name='reload' size={30} color={colorScheme == 'dark' ? '#fff' : '#000'} />
            </TouchableOpacity>
            :
            <ActivityIndicator size={'large'} animating={smallLoading} style={{ marginTop: 12 }} color={colorScheme == 'dark' ? '#fff' : '#000'} />
        }
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center">
            {!isLoading ? (
              <View className="flex justify-center items-center">
                <Image
                  source={images.no_result}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMethod="contain"
                />
                <Text className="text-sm dark:text-white">No exercises found!</Text>
              </View>
            ) : (
              <ActivityIndicator size={50} color={colorScheme == 'dark' ? '#fff' : '#000'} />
            )}
          </View>
        )}
      />
      <BottomSheetModalComponent selectedExercise={selectedExercise} bottomSheetRef={bottomSheetRef} />
    </SafeAreaView >
  )
}

export default BodyPartExercisesDetails

const styles = StyleSheet.create({})