import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    ReactNode,
} from "react";
import {
    registerTaskAsync,
    setNotificationHandler,
    removeNotificationSubscription,
    addNotificationResponseReceivedListener,
    addNotificationReceivedListener,
    getLastNotificationResponseAsync
} from 'expo-notifications'
import { getRegisteredTasksAsync, defineTask } from 'expo-task-manager'

import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import { router } from "expo-router";

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

defineTask(
    BACKGROUND_NOTIFICATION_TASK,
    ({ data, error, executionInfo }) => {
        if (error) {
            console.error("Task Error:", error);
            return;
        }
        const { url } = data.data.body
        console.log("✅ Received a notification in the background!", data);
    }
);

registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const NotificationContext = createContext(
    undefined
);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
};



export const NotificationProvider = ({ children }) => {
    const [expoPushToken, setExpoPushToken] = useState(null);
    const [notification, setNotification] =
        useState(null);
    const [error, setError] = useState(null);

    const notificationListener = useRef();
    const responseListener = useRef();

    const registerTask = async () => {
        const tasks = await getRegisteredTasksAsync();
        if (!tasks.some((task) => task.taskName === BACKGROUND_NOTIFICATION_TASK)) {
            await registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
        }
    };

    useEffect(() => {
        const checkLastNotification = async () => {
            const lastNotificationResponse = await getLastNotificationResponseAsync();
            if (lastNotificationResponse) {
                // console.log('App opened via notification:', lastNotificationResponse);
                handleNotificationResponse(lastNotificationResponse);
            }
        };
        const registerNotificationHandlers = async () => {

            registerForPushNotificationsAsync().then(
                (token) => setExpoPushToken(token),
                (error) => setError(error)
            );

            // Kiểm tra thông báo cuối cùng khi ứng dụng được mở lại
            const lastNotificationResponse = await getLastNotificationResponseAsync();
            if (lastNotificationResponse) {
                // console.log('Last notification response:', JSON.stringify(lastNotificationResponse, null, 2));
                handleNotificationResponse(lastNotificationResponse);
            }

            notificationListener.current =
                addNotificationReceivedListener((notification) => {
                    // console.log("🔔 Notification Received While the app is running: ", JSON.stringify(notification));
                    handleNotificationResponse(notification);
                });

            responseListener.current =
                addNotificationResponseReceivedListener((response) => {
                    console.log(
                        "🔔 Notification Response when user interacted : ",
                        JSON.stringify(response, null, 2),
                        JSON.stringify(response.notification.request.content.data, null, 2)
                    );
                    router.push(response.notification.request.content.data.url)
                    // Handle the notification response here
                });

        }
        const handleNotificationResponse = (response) => {
            const data = response?.notification?.request?.content?.data;
            if (data) {
                console.log('Notification data:', data);
                setNotification(data)
                // Xử lý data nhận được tại đây (ví dụ điều hướng, hiển thị nội dung)
            }
        };
        registerTask()
        checkLastNotification()
        registerNotificationHandlers();

        return () => {
            if (notificationListener.current) {
                removeNotificationSubscription(
                    notificationListener.current
                );
            }
            if (responseListener.current) {
                removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    return (
        <NotificationContext.Provider
            value={{ expoPushToken, notification, error }}
        >
            {children}
        </NotificationContext.Provider>
    );
};