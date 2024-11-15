import { View, Text, Pressable, Image } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../utils/styles";

const ChatComponent = ({ item, handlePressChatComponent, index }) => {
    const navigation = useNavigation();
    const [messages, setMessages] = useState({});
    const { _id, createdBy, created_at, lastMessage, members, roomName, roomImage, roomType, updated_at } = item


    return (
        <Pressable style={styles.cchat} onPress={() => handlePressChatComponent(item)}>

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
                        {lastMessage?.createdAt ? new Date(lastMessage?.createdAt).toLocaleTimeString() : "now"}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

export default ChatComponent;