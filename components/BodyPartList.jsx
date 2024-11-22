import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import BodyPartExercisesCard from './BodyPartExercisesCard'

const BodyPartList = ({ bodyParts }) => {

    return (
        <View className="">
            <FlatList
                data={bodyParts}
                renderItem={({ item }) => (
                    <BodyPartExercisesCard item={item} />
                )}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 16
                }}
            />
        </View>
    )
}

export default BodyPartList

const styles = StyleSheet.create({})