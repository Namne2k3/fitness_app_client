import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import { getToken } from '../libs/token'

const URL = process.env.EXPO_PUBLIC_URL_SERVER
const createUser = async ({ username, email, password, clerkId }) => {
    try {
        await axios.post(`${URL}/api/auth/signup`, { username, email, password, clerkId })
    } catch (error) {
        if (error.response) {
            console.log('Server responded with a status:', error.response.status);
            console.log(error.response.data);
        } else if (error.request) {
            console.log('No response received:', error.request);
        } else {
            console.log('Axios Error:', error.message);
        }
    }
}

const fetchTrainingsByUserId = async (userId) => {
    try {
        const response = await axios.get(`${URL}/api/customtrainings/getByUserId/${userId}?isCustom=${true}`)
        return response.data;
    } catch (error) {
        if (error.response) {

            console.log('Server responded with a status:', error.response.status);
            console.log('Error response data:', error.response.data);
        } else if (error.request) {

            console.log('No response received:', error.request);
        } else {
            console.log('Axios error:', error.message);
        }
    }
}

const createCustomTrainings = async (trainings) => {
    try {
        const response = await axios.post(`${URL}/api/customtrainings/create`, trainings, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        if (error.response) {

            console.log('Server responded with a status:', error.response.status);
            console.log('Error response data:', error.response.data);
        } else if (error.request) {

            console.log('No response received:', error.request);
        } else {

            console.log('Axios error:', error.message);
        }
    }
}

const fetchTrainingById = async (trainingId) => {

    try {
        const res = await axios.get(`${URL}/api/customtrainings/${trainingId}`)
        const data = await res.data;

        return data;
    } catch (error) {
        throw new Error(error)
    }
}

const updateTraining = async (training) => {
    console.log("Check training params >>> ", training);

    const token = await getToken()
    try {
        const res = await axios.put(`${URL}/api/customtrainings/${training?._id}/update`, training, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = await res.data;

        return data;
    } catch (error) {
        throw new Error(error)

    }
}

const deleteTrainingById = async (id) => {
    const token = await getToken()
    try {
        const deleted = await axios.delete(`${URL}/api/customtrainings/${id}/delete`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return deleted.data
    } catch (error) {
        throw new Error(error)
    }
}

const getTrainingRecordById = async (id) => {
    const token = await getToken()
    try {
        const res = await axios.get(`${URL}/api/trainingrecord/getDetail/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

const getWeeklyTrainings = async () => {
    const token = await getToken()
    try {
        const res = await axios.get(`${URL}/api/trainingrecord/getTrainingByWeek`, {
            headers: {
                Authorization: `Bearer ${token}`, // Thay bằng token của bạn
            },
        });
        console.log("Check res data >>> ", res.data);
        return res.data
    } catch (error) {
        throw new Error(error)
    }
};

const getTrainingRecordsByMonth = async (month) => {
    const token = await getToken()
    try {
        const res = await axios.get(`${URL}/api/trainingrecord/getTrainingsByMonth/${month}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

const getTrainingRecord = async () => {
    const token = await getToken()

    try {
        const res = await axios.get(`${URL}/api/trainingrecord/getAllTrainingRecords`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

const createTrainingRecord = async (recordData) => {

    console.log("Check recordData >> ", recordData);


    const token = await getToken()
    try {
        const response = await axios.post(`${URL}/api/trainingrecord/create`, recordData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = await response.data;

        return data;
    } catch (error) {
        throw new Error(error)
    }
}

const getUserByEmail = async (email) => {
    const token = await getToken()
    try {
        const response = await axios.get(`${URL}/api/user/email/${email}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = await response.data;

        return data;
    } catch (error) {
        throw new Error(error)
    }
}

const createFeedback = async (feedback) => {
    try {
        const response = await axios.post(`${URL}/api/feedback/create`, feedback, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.data;

        return data;
    } catch (error) {
        throw new Error(error)
    }
}

const handleUpdateUser = async (userBody) => {
    const token = await getToken()
    try {
        const response = await axios.put(`${URL}/api/user/${userBody._id}`, userBody, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        throw new Error(error)
    }
}

const handleUpdateUserByEmail = async (email, newPassword) => {
    try {
        const response = await axios.put(`${URL}/api/user/email/${email}`, { password: newPassword }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data;
    } catch (error) {
        console.log("Error: ", error, message);
    }
}

const isEmailExist = async (email) => {
    try {
        const response = await axios.get(`${URL}/api/user/check_email/${email}`)
        const data = await response.data;

        return data;
    } catch (error) {
        console.log("Error message >>> ", error.message);
    }
}

const uploadFiles = async (medias) => {

    const token = await getToken()
    const formData = new FormData();

    medias.forEach((asset, index) => {
        const uriParts = asset.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('files', {
            uri: asset.uri,
            name: `file_${index}.${fileType}`,
            type: asset.type === 'image' ? `image/${fileType}` : `video/${fileType}`,
        });
    });

    // Gửi yêu cầu upload tệp lên server
    try {
        const response = await axios.post(`${URL}/api/feed/uploads`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.log("Error response data:", error.response.data);
            throw new Error(error.response.data.message || 'Upload failed');
        } else {
            console.log("Error: ", "File too large!");
            throw new Error("File too large!");
        }
    }
}

const createNewFeed = async (feed) => {
    const token = await getToken()
    try {
        const res = await axios.post(`${URL}/api/feed/create`, feed, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        return res.data;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Error creating feed!");
    }
}

const getAllBlog = async () => {
    try {
        const res = await axios.get(`${URL}/api/feed/getAll`)

        return res.data;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Error creating feed!");
    }
}

const getBlogById = async (id) => {
    try {
        const res = await axios.get(`${URL}/api/feed/getDetail/${id}`)
        return res.data;
    } catch (error) {
        throw new Error("Error creating feed!");
    }
}

const updateBlogById = async (id, feed) => {
    const token = await getToken()
    try {
        const res = await axios.put(`${URL}/api/feed/update/${id}`, feed, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return res.data;
    } catch (error) {
        throw new Error(error);
    }
}

const getUserById = async (id) => {
    const token = await getToken()
    try {
        const res = await axios.get(`${URL}/api/user/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

const createNewChatRoom = async (chatroom) => {
    const token = await getToken()
    try {
        const res = await axios.post(`${URL}/api/chatroom/create`, chatroom, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    } catch (error) {
        console.log("Check error message >>> ", error.message);

        throw new Error(error)
    }
}

const findChatRoom = async (userId, userProfileId) => {
    const token = await getToken()
    try {
        const res = await axios.get(`${URL}/api/chatroom/getDetail?userId=${userId}&userProfileId=${userProfileId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

const getFeedsByUserId = async (userId) => {
    const token = await getToken()
    try {
        const res = await axios.get(`${URL}/api/feed/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

const getAllChatRooms = async () => {
    const token = await getToken()

    try {
        const res = await axios.get(`${URL}/api/chatroom/getAll`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data
    } catch (error) {
        throw new Error(error)
    }
}

const createMessage = async (message) => {
    const token = await getToken()

    try {
        const res = await axios.post(`${URL}/api/chatroom/addMessage`, message, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data
    } catch (error) {
        throw new Error(error)
    }
}

const getAllMessagesByRoomId = async (roomId, { limit, skip }) => {
    const token = await getToken()

    try {
        const res = await axios.get(`${URL}/api/chatroom/getAllMessages/${roomId}?limit=${limit}&skip=${skip}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data
    } catch (error) {
        throw new Error(error)
    }
}

const updateLastMessageForRoomChatById = async (roomId, lastMessage) => {
    const token = await getToken()

    try {
        const res = await axios.put(`${URL}/api/chatroom/update/${roomId}`, lastMessage, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data
    } catch (error) {
        throw new Error(error)
    }
}

const getAllExercises = async () => {
    const token = await getToken()

    try {
        const res = await axios.get(`${URL}/api/exercises/getAllExercises`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

const getAllExercisesByBodyPart = async (bodyPart, { limit, skip }) => {
    const token = await getToken()

    try {
        const res = await axios.get(`${URL}/api/exercises/getAllExercisesByBodyPart/${bodyPart}?limit=${limit}&skip=${skip}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

const getAllExercisesBySearchQueryName = async (searchQueryName, { limit, skip, bodyParts, equipments }) => {
    const token = await getToken()

    try {
        const res = await axios.get(`${URL}/api/exercises/getAllExercisesBySearchQueryName/${searchQueryName}?limit=${limit}&skip=${skip}&bodyParts=${JSON.stringify(bodyParts)}&equipments=${JSON.stringify(equipments)}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

const getExerciseById = async (id) => {
    const token = await getToken()

    try {
        const res = await axios.get(`${URL}/api/exercises/getExerciseById/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

const getAllBodyPart = async () => {
    const token = await getToken()

    try {
        const res = await axios.get(`${URL}/api/exercises/getAllBodyParts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

const createTrainings = async (trainings) => {
    const token = await getToken();

    try {
        const res = await axios.post(`${URL}/api/trainings/create`, trainings, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

const getAllTrainingsByUserId = async () => {
    const token = await getToken();

    try {
        const res = await axios.get(`${URL}/api/trainings/getByUserId?isCustom=${false}&isInPlan=${false}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

const createPlans = async (data) => {
    const token = await getToken();

    try {
        const res = await axios.post(`${URL}/api/plan/createPlans`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

const getAllPlansByUserId = async () => {
    const token = await getToken();

    try {
        const res = await axios.get(`${URL}/api/plan/getAllPlansByUserId`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

const updateCurrentPlanById = async (planId, index) => {
    const token = await getToken()
    try {

        const res = await axios.put(`${URL}/api/plan/updateCurrentPlanById/${planId}?current=${index}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data

    } catch (error) {
        throw new Error(error)
    }
}

const createCalendarNotify = async (calendarNotify) => {
    const token = await getToken()
    try {
        const res = await axios.post(`${URL}/api/calendar/create`, calendarNotify, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

const getCalendars = async () => {
    const token = await getToken()
    try {
        const res = await axios.get(`${URL}/api/calendar/getCalendars`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

const deleteNotificationById = async (id) => {
    const token = await getToken()
    try {
        const res = await axios.delete(`${URL}/api/calendar/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

const deleteAllNotificationPassedByUserId = async () => {
    const token = await getToken()
    try {
        const res = await axios.delete(`${URL}/api/calendar/delete/deleteNotificationsPassed`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

export {
    getWeeklyTrainings,
    deleteAllNotificationPassedByUserId,
    deleteNotificationById,
    getCalendars,
    createCalendarNotify,
    updateCurrentPlanById,
    getAllPlansByUserId,
    createPlans,
    getAllTrainingsByUserId,
    createTrainings,
    getAllExercises,
    getAllBodyPart,
    getAllExercisesByBodyPart,
    getAllExercisesBySearchQueryName,
    getExerciseById,
    updateLastMessageForRoomChatById,
    createMessage,
    getAllMessagesByRoomId,
    findChatRoom,
    getAllChatRooms,
    getFeedsByUserId,
    getUserById,
    createNewChatRoom,
    updateBlogById,
    getBlogById,
    getAllBlog,
    createNewFeed,
    createUser,
    handleUpdateUserByEmail,
    isEmailExist,
    createFeedback,
    getTrainingRecord,
    getTrainingRecordById,
    createCustomTrainings,
    getUserByEmail,
    fetchTrainingsByUserId,
    fetchTrainingById,
    updateTraining,
    deleteTrainingById,
    getTrainingRecordsByMonth,
    createTrainingRecord,
    handleUpdateUser,
    uploadFiles
}