import { useEffect, useState } from 'react';

const useFetchData = (fetchFunction) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchFunction();
                setData(result?.data || []);
            } catch (error) {
                console.error('Error fetching data:', error.message);
                Alert.alert('Error', error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [fetchFunction]);

    return { data, loading };
};

export {
    useFetchData
}
// Usage in Plan Component
// const { data: plans, loading: isLoading } = useFetchData(getAllPlansByUserId);

