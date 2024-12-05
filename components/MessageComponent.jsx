import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image'
import styles from '../utils/styles';
const MessageComponent = ({ item, user, roomImage, openModal }) => {

    const status = item.senderId !== user?._id;
    const hasImedias = item?.medias?.length > 0
    return (
        <View>
            <View
                style={
                    status
                        ? styles.mmessageWrapper
                        : [styles.mmessageWrapper, { alignItems: "flex-end" }]
                }
                className="mt-2"
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {
                        status && <>
                            <Image
                                source={{ uri: roomImage }}
                                width={30}
                                height={30}
                                className="rounded-full mr-2"
                                contentFit='cover'
                            />
                        </>
                    }
                    {
                        item?.content &&
                        <View
                            style={
                                status
                                    ? styles.mmessage
                                    : [styles.mmessage, { backgroundColor: "rgb(194, 243, 194)" }]
                            }
                        >
                            <Text>{item?.content}</Text>
                        </View>
                    }
                </View>
                {
                    hasImedias &&
                    <View className={`flex flex-row flex-wrap w-[65%] ${status ? 'justify-start' : 'justify-end'}`}>
                        {
                            item?.medias?.map((img, index) => {
                                return (
                                    <TouchableOpacity onPress={() => openModal(img)} key={`${img.fileUrl}_${index}`}>
                                        <Image
                                            source={{
                                                uri: img.fileUrl
                                            }}
                                            width={100}
                                            height={100}
                                            contentFit='cover'
                                            className="m-1 rounded-md border-[0.5px]"
                                        />
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                }
                <Text className="font-pitalic">{new Date(item.created_at).toLocaleTimeString()}</Text>
            </View>
        </View>
    );
}

export default MessageComponent
