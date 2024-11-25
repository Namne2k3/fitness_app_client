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
                paddingVertical: 16
            }}
        />

    )
}

export default BodyPartList

const styles = StyleSheet.create({})