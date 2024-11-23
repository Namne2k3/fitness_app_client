import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useState, useCallback } from 'react'
import BodyPartExercisesCard from './BodyPartExercisesCard'

const BodyPartList = ({ fetchBodyParts, bodyParts }) => {

    const [refreshing, setRefreshing] = useState(false);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchBodyParts();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);
    return (
        <View className="">
            <FlatList
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
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