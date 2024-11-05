import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BodyPartList from "./BodyPartList";
import { getAllBodyParts } from "../libs/exerciseDb";
import { Text } from "react-native";

const TrainingContent = () => {


    const [bodyParts, setBodyParts] = useState([])

    useEffect(() => {
        const fetchBodyParts = async () => {
            const data = await getAllBodyParts()
            if (data) {
                setBodyParts(data)
            }
        }

        fetchBodyParts();
    }, [])

    return (
        <SafeAreaView className="flex justify-center items-start px-4 bg-[#fff] dark:bg-slate-950 h-full" >
            <BodyPartList bodyParts={bodyParts} />
        </SafeAreaView >

    );
}

export default TrainingContent