import axios from "axios";
const url = 'https://exercisedb.p.rapidapi.com'
const headers = {
    'x-rapidapi-key': process.env.EXPO_PUBLIC_X_RAPIDAPI_KEY,
    'x-rapidapi-host': process.env.EXPO_PUBLIC_X_RAPIDAPI_HOST
}



const getAllBodyParts = async () => {
    try {
        const res = await axios.get(`${url}/exercises/bodyPartList`, {
            headers: headers
        })
        const data = await res.data

        return data;
    } catch (err) {
        console.log(err);
    }
}

const fetchAllExercisesByBodyPart = async (bodyPart, offset = 0) => {
    try {
        const res = await axios.get(`${url}/exercises/bodyPart/${bodyPart}`, {
            headers: headers,
            params: {
                limit: '100',
                offset: `0`
            }
        })
        const data = await res.data

        return data;
    } catch (error) {
        console.log(error);
    }
}

const fetchExerciseByQuery = async (query) => {
    try {
        if (query !== "") {

            const res = await axios.get(`${url}/exercises/name/${query}`, {
                headers: headers,
                params: {
                    limit: '100',
                    offset: `0`
                }
            })
            const data = await res.data;
            return data;
        } else {
            const res = await axios.get(`${url}/exercises`, {
                headers: headers,
                params: {
                    limit: '100',
                    offset: `0`
                }
            })
            const data = await res.data;
            return data;
        }

    } catch (error) {
        console.log(error);

    }
}

const fetchExerciseById = async (id) => {
    try {
        const res = await axios.get(`${url}/exercises/exercise/${id}`, {
            headers: headers
        })
        const data = await res.data
        return data;
    } catch (error) {
        console.log("Co loi: ", error.message);
    }
}

export {
    getAllBodyParts,
    fetchAllExercisesByBodyPart,
    fetchExerciseByQuery,
    fetchExerciseById
}