import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CommentCard from './CommentCard'

const CommentList = ({ comments }) => {
    return (
        <FlatList
            nestedScrollEnabled
            contentContainerStyle={{
                backgroundColor: "#fff"
            }}
            data={comments}
            renderItem={({ item }) => (
                <CommentCard comment={item} />
            )}
        />
    )
}

export default CommentList

const styles = StyleSheet.create({})