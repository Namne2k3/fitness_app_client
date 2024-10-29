import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const CustomButton = ({ disabled, onPress, text, containerStyle, bgColor = "bg-[#00008B]", textStyle }) => {
    return (
        <TouchableOpacity onPress={disabled ? () => { } : onPress} className={`w-full p-4 rounded-lg ${bgColor} ${containerStyle}`}>
            <View>
                <Text style={textStyle} className={`text-white font-psemibold text-lg text-center capitalize`}>{text}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default CustomButton

const styles = StyleSheet.create({})