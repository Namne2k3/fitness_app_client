import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllBodyParts } from "../libs/exerciseDb";
import { getAllBodyPart } from '../libs/mongodb'
import BodyPartList from "./BodyPartList";

const TrainingContent = () => {


    const [bodyParts, setBodyParts] = useState([])

    useEffect(() => {
        const fetchBodyParts = async () => {
            const res = await getAllBodyPart()
            if (res.data) {
                setBodyParts(res.data)
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