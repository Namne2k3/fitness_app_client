import React from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image'
import styles from '../utils/styles';
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
                                contentFit='cover'
                            />
                        </> : <>
                            <Image
                                source={{ uri: user?.image }}
                                width={30}
                                height={30}
                                className="rounded-full mr-2"
                                contentFit='cover'
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
                        <Text>{item?.content}</Text>
                    </View>
                </View>
                <Text style={{ marginLeft: 40 }}>{new Date(item.created_at).toLocaleTimeString()}</Text>
            </View>
        </View>
    );
}

export default MessageComponent
