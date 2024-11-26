import { useState } from "react";
import { Image } from 'expo-image'
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { icons } from "../constants/icon";

const InputField = ({
    onChange,
    label,
    labelStyle,
    icon,
    secureTextEntry = false,
    containerStyle,
    inputStyle,
    iconStyle,
    className,
    value,
    textRight,
    placeholder,
    ...props
}) => {

    const [showPassword, setShowPassword] = useState(false)

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className={`my-2 ${className}`}>
                    {
                        label && (
                            <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>
                                {label}
                            </Text>
                        )
                    }
                    <View
                        className={`flex flex-row justify-between items-center relative bg-neutral-100 rounded-full border border-neutral-100 ${containerStyle}`}
                    >
                        {icon && icon}
                        <TextInput
                            value={value}
                            className={`rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 ${inputStyle} text-left`}
                            secureTextEntry={label === 'Mật khẩu' && !showPassword}
                            {...props}
                            onChangeText={text => onChange(text)}
                            placeholder={placeholder}
                            autoCapitalize={'none'}
                        />
                        {
                            label === 'Mật khẩu' || label === 'Nhập lại mật khẩu' ? (
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-4">
                                    <Image
                                        className="w-6 h-6" contentFit='contain'
                                        source={!showPassword ? icons.eye_hide : icons.eye}
                                    />
                                </TouchableOpacity>
                            ) : null
                        }
                        {
                            textRight &&
                            <Text className="mr-4">{textRight}</Text>
                        }
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
};

export default InputField;
