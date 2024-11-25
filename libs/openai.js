import axios from 'axios';

const API_KEY = 'your_openai_api_key';

const openAI = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    },
});



export const generateText = async (prompt) => {
    try {
        const response = await openAI.post('/completions', {
            model: 'text-davinci-004',
            prompt: prompt,
            max_tokens: 150,
        });
        return response.data.choices[0].text;
    } catch (error) {
        console.error('Error generating text:', error);
        throw error;
    }
};