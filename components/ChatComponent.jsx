import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import styles from "../utils/styles";

const ChatComponent = ({ item, handlePressChatComponent, index }) => {
    const navigation = useNavigation();
    const [messages, setMessages] = useState({});
    const { _id, createdBy, created_at, lastMessage, members, roomName, roomImage, roomType, updated_at } = item


    return (
        <Pressable
            style={styles.cchat}
            onLongPress={() => console.log('Long press')}
            onPress={() => handlePressChatComponent(item)}
        >

            <Image
                source={{ uri: roomImage }}
                style={styles.cavatar}
                width={50}
                height={50}
                className='rounded-full'
                resizeMode='cover'
            />

            <View style={styles.crightContainer}>
                <View>
                    <Text style={styles.cusername}>{roomName}</Text>

                    <Text style={styles.cmessage}>
                        {lastMessage?.content ? lastMessage?.content : "Tap to start chatting"}
                    </Text>
                </View>
                <View>
                    <Text style={styles.ctime}>
                        {updated_at ? new Date(updated_at).toLocaleTimeString() : "now"}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

export default ChatComponent;