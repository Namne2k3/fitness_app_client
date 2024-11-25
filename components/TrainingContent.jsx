import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllBodyParts } from "../libs/exerciseDb";
import { getAllBodyPart, getAllTrainingsByUserId } from '../libs/mongodb'
import BodyPartList from "./BodyPartList";
import { View } from "react-native";

const TrainingContent = () => {


    const [bodyParts, setBodyParts] = useState([])
    const fetchBodyParts = useCallback(async () => {
        const res = await getAllTrainingsByUserId()
        if (res.data) {
            setBodyParts(res.data)
        }
    }, [])
    useEffect(() => {

        fetchBodyParts();
    }, [])

    return (
        <View className="flex justify-center items-start px-4  dark:bg-slate-950 h-full" >
            <BodyPartList fetchBodyParts={fetchBodyParts} bodyParts={bodyParts} />
        </View >

    );
}

export default TrainingContent