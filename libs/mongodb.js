import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import { getToken } from '../libs/token'

const URL = process.env.EXPO_PUBLIC_URL_SERVER || "https://w2fw01lr-3000.asse.devtunnels.ms"
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
        const response = await axios.get(`${URL}/api/customtrainings/getByUserId/${userId}`)
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

const createTrainings = async (trainings) => {
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
        console.log(error.message);
    }
}

const updateTraining = async (training) => {
    try {
        const res = await axios.put(`${URL}/api/customtrainings/${training?._id}/update`, training)
        const data = await res.data;

        return data;
    } catch (error) {
        console.log(error.message);

    }
}

const deleteTrainingById = async (id) => {
    try {
        const deleted = await axios.delete(`${URL}/api/customtrainings/${id}/delete`)
        return deleted.data
    } catch (error) {
        console.log(error.message);
    }
}

const getTrainingRecordById = async (id) => {
    try {
        const res = await axios.get(`${URL}/api/trainingrecord/${id}`)
        return res.data;
    } catch (error) {
        console.log(error.message);
    }
}

const getTrainingRecordsByMonth = async (month, userId) => {
    try {
        const res = await axios.get(`${URL}/api/trainingrecord/${userId}/getTrainingsByMonth/${month}`)
        return res.data;
    } catch (error) {
        console.log(error.message);
    }
}

const getTrainingRecord = async (userId) => {
    try {
        const res = await axios.get(`${URL}/api/trainingrecord/${userId}/getAllTrainingRecords`)

        return res.data;
    } catch (error) {
        console.log(error.message);
    }
}

const createTrainingRecord = async (recordData) => {
    try {
        const response = await axios.post(`${URL}/api/trainingrecord/create`, recordData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.data;

        return data;
    } catch (error) {
        console.log(error.message);
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
        console.log(error.message);
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
        console.log(error.message);
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
        console.log(error.message);
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
        throw new Error(error.message);
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
        throw new Error(error.message)
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

        throw new Error(error.message)
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
        throw new Error(error.message)
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
        throw new Error(error.message)
    }
}

export {
    findChatRoom,
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
    createTrainings,
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