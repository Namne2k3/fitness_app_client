import { Image, Text, View } from 'react-native'
import React from 'react'
import styles from '../utils/styles'
import { Ionicons } from "@expo/vector-icons";
const MessageComponent = ({ item, user, roomImage }) => {

    const status = item.senderId !== user?._id;

    return (
        <View>
            <View
                style={
                    status
                        ? styles.mmessageWrapper
                        : [styles.mmessageWrapper, { alignItems: "flex-end" }]
                }
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {
                        status ? <>
                            <Image
                                source={{ uri: roomImage }}
                                width={30}
                                height={30}
                                className="rounded-full mr-2"
                                resizeMode='cover'
                            />
                        </> : <>
                            <Image
                                source={{ uri: user?.image }}
                                width={30}
                                height={30}
                                className="rounded-full mr-2"
                                resizeMode='cover'
                            />
                        </>
                    }
                    <View
                        style={
                            status
                                ? styles.mmessage
                                : [styles.mmessage, { backgroundColor: "rgb(194, 243, 194)" }]
                        }
                    >
                        <Text>{item.content}</Text>
                    </View>
                </View>
                <Text style={{ marginLeft: 40 }}>{item.time}</Text>
            </View>
        </View>
    );
}

export default MessageComponent