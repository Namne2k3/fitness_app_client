import { FlatList, Image, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import ExerciseDetailCard from '../../../components/ExerciseDetailCard'
import { images } from '../../../constants/image'
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { fetchAllExercisesByBodyPart } from '../../../libs/exerciseDb'
import BottomSheetModalComponent from '../../../components/BottomSheetModal'
import { useColorScheme } from 'nativewind'

const ListHeaderComponent = ({ name }) => {

  return (
    <View className="flex flex-row justify-between items-center mb-4">
      <View>
        <Text className="dark:text-white font-pextrabold text-[32px] uppercase">{name}</Text>
        <Text className=" dark:text-white -mt-4 font-pextrabold text-[32px] uppercase">workout</Text>
      </View>
      <View className="">
        <Image
          source={images[name]}
          className="w-[100px] h-[100px] rounded-full"
          resizeMode='cover'
        />
      </View>
    </View>
  )
}
const BodyPartExercisesDetails = () => {

  const { name } = useLocalSearchParams()
  const [loading, setLoading] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState({})
  const [offset, setOffSet] = useState(1)
  const { colorScheme } = useColorScheme()
  const [exercisesBodyParts, setExercisesBodyParts] = useState([])
  const bottomSheetRef = useRef(null)

  const handlePresentModalSheet = useCallback((item) => {
    bottomSheetRef.current?.present()
    setSelectedExercise(item)

  })
  const fetchDetailBodyExercises = async (offsetProps = 0) => {
    setLoading(true)
    const data = await fetchAllExercisesByBodyPart(name.toLowerCase())
    if (data) {
      setExercisesBodyParts(data);
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchDetailBodyExercises()

    return () => {
      setOffSet(0)
    }
  }, [name])

  return (
    <SafeAreaView className="bg-[#fff] h-full px-6 dark:bg-slate-950">

      <FlatList
        data={exercisesBodyParts}
        ListHeaderComponent={() => <ListHeaderComponent name={name} />}
        renderItem={({ item }) => <ExerciseDetailCard handlePresentModalSheet={handlePresentModalSheet} exercise={item} />}
        ItemSeparatorComponent={() =>
          <View className="h-[16px] bg-[#fff] dark:bg-slate-950" />
        }
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 16,
          // flex: 1,
        }}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center">
            {!loading ? (
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