import { useEffect, useState } from "react";
import { getAllTrainingsByUserId } from '../../libs/mongodb'
import BodyPartList from "../../components/BodyPartList";
import { View } from "react-native";

const TrainingContent = () => {

    const [bodyParts, setBodyParts] = useState([])

    const fetchBodyParts = async () => {
        const res = await getAllTrainingsByUserId()

        if (res.data) {

            setBodyParts(res.data)
        }
    }
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