import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ReportComponent = ({ title, children, rightComponent }) => {
    return (
        <View className="mt-4 pb-4">
            <View className="mx-4 flex flex-row justify-between items-center">
                <Text className="capitalize font-pextrabold text-lg dark:text-white">{title}</Text>
                {
                    rightComponent && rightComponent
                }
            </View>
            {children}
        </View>
    )
}

export default ReportComponent

const styles = StyleSheet.create({})