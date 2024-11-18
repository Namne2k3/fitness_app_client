import axios from "axios";
const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY
const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`;

export const analyzeImage = async (base64Images) => {
    try {

        const requestBody = {
            requests: base64Images.map((image) => {

                let cleanBase64 = image.replace(/^data:image\/\w+;base64,/, '');

                return ({
                    image: {
                        content: cleanBase64,
                    },
                    features: [
                        {
                            type: 'SAFE_SEARCH_DETECTION'
                        },
                    ],
                })
            })
        };

        const response = await axios.post(VISION_API_URL, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            },
        });

        console.log("Check response.data >>> ", response.data);
        return response.data;
    } catch (error) {
        console.error('Error calling Google Vision API:', error.message);
        throw error;
    }
};

