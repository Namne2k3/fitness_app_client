
import { images } from '@/constants/image';
import { seedPlanData } from '@/constants/seeds'
import { createTrainings } from '@/libs/mongodb';
import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';
import { Alert } from 'react-native';

export function analyzeUser(weight, height, targetWeight) {
    if (!weight || !height || !targetWeight) {
        throw new Error("Chưa có một trong các dữ liệu sau (Chiều cao, cân nặng, mục tiêu cân nặng).");
    }

    const calculateBMI = (weight, height) => (weight / ((height / 100) ** 2)).toFixed(2);
    const currentBMI = calculateBMI(weight, height);
    const targetBMI = calculateBMI(targetWeight, height);

    const percentageWeightChange = Math.abs(((targetWeight - weight) / weight) * 100).toFixed(2);

    let result = {
        title: "",
        subtitle: "",
        body: ""
    };

    // Define thresholds
    const lowerLimit = 0.90 * weight; // 90% of current weight
    const upperLimit = 1.10 * weight; // 110% of current weight
    const effortLimit = 1.15 * weight; // 115% of current weight
    const challengeLimit = 1.35 * weight; // 135% of current weight

    // Classify target weight
    if (targetWeight < lowerLimit) {
        result = {
            title: "Cảnh báo",
            subtitle: `Bạn sẽ giảm ${percentageWeightChange}% trọng lượng cơ thể`,
            body: `
Giảm cân quá mức có thể gây hại cho sức khỏe:
- Mệt mỏi và suy nhược cơ thể
- Suy giảm hệ miễn dịch
- Nguy cơ mắc bệnh thiếu máu
Hãy tham khảo ý kiến chuyên gia để điều chỉnh mục tiêu phù hợp.
            `
        };
    } else if (targetWeight >= lowerLimit && targetWeight <= upperLimit) {
        result = {
            title: "Mục tiêu hợp lý",
            subtitle: `Bạn sẽ thay đổi ${percentageWeightChange}% trọng lượng cơ thể`,
            body: `
Những thay đổi nhỏ về cân nặng có thể mang lại lợi ích lớn:
- Hạ huyết áp
- Giảm nguy cơ mắc bệnh tiểu đường
- Cải thiện sức khỏe tổng thể
Hãy duy trì chế độ luyện tập và ăn uống cân bằng để đạt được mục tiêu.
            `
        };
    } else if (targetWeight > upperLimit && targetWeight <= effortLimit) {
        result = {
            title: "Lựa chọn nỗ lực",
            subtitle: `Bạn sẽ tăng ${percentageWeightChange}% trọng lượng cơ thể`,
            body: `
Mục tiêu này có thể đạt được với một chút nỗ lực:
- Tăng cường sức mạnh cơ bắp
- Cải thiện năng lượng và sức bền
- Xây dựng hình thể lý tưởng
Hãy tập trung vào chế độ dinh dưỡng và luyện tập để đạt kết quả tốt.
            `
        };
    } else if (targetWeight > effortLimit && targetWeight <= challengeLimit) {
        result = {
            title: "Thử thách",
            subtitle: `Bạn sẽ tăng ${percentageWeightChange}% trọng lượng cơ thể`,
            body: `
Mục tiêu này đòi hỏi sự kiên nhẫn và quyết tâm cao:
- Cần thời gian để xây dựng khối lượng cơ
- Tăng cường sự tự tin và sức mạnh
- Cải thiện đáng kể vóc dáng
Hãy xây dựng kế hoạch chi tiết và kiên định với mục tiêu.
            `
        };
    } else if (targetWeight > challengeLimit) {
        result = {
            title: "Cảnh báo",
            subtitle: `Bạn sẽ tăng ${percentageWeightChange}% trọng lượng cơ thể`,
            body: `
Tăng cân quá mức có thể gây hại cho sức khỏe:
- Gia tăng nguy cơ béo phì
- Nguy cơ mắc các bệnh tim mạch
- Tăng áp lực lên khớp và xương
Hãy tham khảo ý kiến chuyên gia để điều chỉnh mục tiêu.
            `
        };
    }

    return {
        currentBMI: currentBMI,
        targetBMI: targetBMI,
        percentageWeightChange: `${percentageWeightChange}%`,
        conclusion: result
    };
}

export const BMR = (user) => {

    const { weight, height, age, gender } = user;

    return gender == "nam"
        ?
        (
            (10 * weight) + (6.25 * height) - (5 * age) + 5
        )
        :
        (
            (10 * weight) + (6.25 * height) - (5 * age) + 161
        )
}
export function calculateTrainingPlan(userData) {

    try {
        const {
            weight,
            targetWeight,
            tdee,
            healthGoal,
            level
        } = userData;

        if (weight && targetWeight && tdee && healthGoal && level) {
            const adjustedTDEE = tdee;

            let daysShouldTraining = 0;
            let proteinMultiplier = 0;
            let fatPercentage = 0;

            // Xác định ngày tập luyện và hệ số protein
            if (healthGoal === "Tăng cơ") {
                daysShouldTraining = level === "Người mới bắt đầu" ? 4 : 5;
                proteinMultiplier = 2.2; // Tăng cơ: 2.2g/kg
                fatPercentage = 0.25; // 25% TDEE cho fat
            } else if (healthGoal === "Giảm mỡ") {
                daysShouldTraining = 5;
                proteinMultiplier = 1.8; // Giảm mỡ: 1.8g/kg
                fatPercentage = 0.20; // 20% TDEE cho fat
            } else if (healthGoal === "Cân đối tổng thể") {
                daysShouldTraining = 3;
                proteinMultiplier = 1.5; // Cân đối: 1.5g/kg
                fatPercentage = 0.25; // 25% TDEE cho fat
            } else if (healthGoal === "Sức mạnh") {
                daysShouldTraining = 4;
                proteinMultiplier = 2; // Sức mạnh: 2g/kg
                fatPercentage = 0.30; // 30% TDEE cho fat
            }

            // Tính lượng protein và fat
            const proteinRequirement = Math.ceil(weight * proteinMultiplier); // Lượng protein (g)
            const fatRequirement = Math.ceil(adjustedTDEE * fatPercentage / 9); // Lượng fat (g), 1g fat = 9 calo

            // Tính calo mỗi buổi tập
            const minCaloriesPerTraining = Math.floor(adjustedTDEE * 0.10);
            const maxCaloriesPerTraining = Math.floor(adjustedTDEE * 0.20);
            const caloriesPerTraining = (minCaloriesPerTraining + maxCaloriesPerTraining) / 2;

            // Tốc độ tăng cân/giảm cân lành mạnh
            const calorieSurplusPerDay = healthGoal === "Tăng cơ" ? 500 : -500; // Dư/thâm hụt 500 calo mỗi ngày
            const calorieChangePerKg = 7700; // Calo để tăng/giảm 1 kg

            // Tổng số ngày để đạt cân nặng mục tiêu
            let totalDaysToReachTarget = 0;
            if (targetWeight !== weight) {
                const totalWeightChange = Math.abs(targetWeight - weight); // Tổng số kg cần thay đổi
                const totalCaloriesChange = totalWeightChange * calorieChangePerKg;
                totalDaysToReachTarget = Math.ceil(totalCaloriesChange / Math.abs(calorieSurplusPerDay));
            }

            // Phân phối calo theo từng bữa
            const mealDistribution = {
                breakfast: Math.ceil(adjustedTDEE * 0.3),
                lunch: Math.ceil(adjustedTDEE * 0.4),
                dinner: Math.ceil(adjustedTDEE * 0.3)
            };

            console.log("Check all >> ", {
                daysShouldTraining,
                caloriesPerTraining,
                proteinRequirement,
                fatRequirement,
                totalDaysToReachTarget,
                mealDistribution
            });

            return {
                daysShouldTraining,
                caloriesPerTraining,
                proteinRequirement,
                fatRequirement,
                totalDaysToReachTarget,
                mealDistribution
            };
        } else {
            throw new Error("Thiếu thông tin")
        }
    } catch (error) {
        throw new Error(error.message)
    }
}


export function generatePrompt(trainingRecord) {
    try {


        const training = JSON.parse(trainingRecord.training);
        const exercises = training.exercises;
        const totalTime = trainingRecord.duration;

        let prompt = `Giúp tôi tính calo tiêu hao cho buổi tập:\n`;

        exercises.forEach((exerciseData, index) => {
            const exercise = exerciseData.exercise;
            const sets = exerciseData.sets;

            // Tạo thông tin bài tập
            let exerciseInfo = `- ${exercise.name}: `;
            let setsInfo = sets
                .map((set, setIndex) => {
                    return `${set.reps} reps x ${set.kilogram} kg${setIndex === sets.length - 1 ? '' : ', '}`;
                })
                .join("");
            exerciseInfo += `${sets.length} sets (${setsInfo}).`;

            prompt += exerciseInfo + `\n`;
        });

        prompt += `- Tổng thời gian: ${totalTime}, chia đều cho ${exercises.length} bài tập.\n`;

        return prompt;
    } catch (error) {
        console.log("error prompt >>> ", error.message);

    }
}

export const calculateCaloriesBurned = (time, trainingData, bodyWeightKg) => {
    if (trainingData) {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        const totalDurationInMinutes = (hours * 60) + minutes + (seconds / 60);
        const totalExercises = trainingData?.exercises?.length;
        const timePerExerciseInMinutes = totalDurationInMinutes / totalExercises;

        let totalCaloriesBurned = 0;

        trainingData?.exercises.forEach(exercise => {
            const sets = exercise.sets;
            const timePerSetInMinutes = timePerExerciseInMinutes / sets.length;
            let exerciseCaloriesBurned = 0;
            sets.forEach(set => {
                let MET;

                if (set.reps < 5) {
                    MET = 6 + (set.kilogram * 0.05);
                } else if (set.reps >= 6 && set.reps <= 12) {
                    MET = 4 + (set.kilogram * 0.03);
                } else {
                    MET = 3 + (set.kilogram * 0.02);
                }


                const caloriesBurnedPerSet = MET * bodyWeightKg * (timePerSetInMinutes / 60) * 1.05;
                exerciseCaloriesBurned += caloriesBurnedPerSet;
            });

            totalCaloriesBurned += exerciseCaloriesBurned;
        });

        return totalCaloriesBurned;
    }
}
const createPlansForUser = async (user, createdTrainings) => {
    const planData = seedPlanData

    const createPlanForGender = async (gender) => {
        const plans = [];

        for (const planName in planData[gender]) {
            const planDays = planData[gender][planName];
            const trainings = planDays.map((day, index) => {

                const training = createdTrainings.find(t => t.title.toLowerCase() === day && t.user === user._id);
                if (training) {
                    return {
                        title: training.name ? 'Ngày nghỉ' : `Ngày ${index + 1}`,
                        name: training.title ?? 'Nghỉ ngơi',
                        exercises: training.exercises ?? [],
                        user: user._id,
                        isInPlan: true
                    };
                }
            }).filter(Boolean)

            const savedTrainingData = await createTrainings(trainings)


            plans.push({
                name: planName,
                user: user._id,
                gender: gender,
                trainings: savedTrainingData?.data?.map((item) => item._id),
            });


        }
        return plans;
    };

    const plans = await createPlanForGender(user.gender);

    return plans;
};

const getSortedExercisesByName = (exercises) => {
    return exercises.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
}
function getAbbreviation(params) {
    const words = params?.split(' ');

    const abbreviation = words?.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
    return abbreviation;
}

function formatTime(isoString) {
    const date = new Date(isoString);

    // Lấy giờ và phút
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Thêm số 0 vào trước nếu là số nhỏ hơn 10
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutes}`;
}


function formatDate(isoString) {
    const date = new Date(isoString);

    // const options = { month: 'short', day: 'numeric' };
    const options = { day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatDateWithMonth(isoString) {
    const date = new Date(isoString);

    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}


function randomColor() {
    // Giới hạn khoảng giá trị từ 0 đến 200 (để tránh các giá trị gần với 255, là màu trắng)
    const getRandomChannel = () => Math.floor(Math.random() * 200);

    // Tạo ra giá trị RGB
    const red = getRandomChannel();
    const green = getRandomChannel();
    const blue = getRandomChannel();

    // Chuyển đổi RGB thành chuỗi hex và trả về
    const hexColor = `#${((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1).toUpperCase()}`;
    return hexColor;
}

function countDataByDaysInMonth(data) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Tính tổng số ngày của tháng hiện tại
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Tạo mảng với độ dài bằng số ngày trong tháng, ban đầu tất cả là 0
    const daysCount = Array(daysInMonth).fill(0);

    // Duyệt qua dữ liệu và đếm số lượng cho từng ngày
    data?.forEach(item => {
        const createdAt = new Date(item.created_at);
        const year = createdAt.getFullYear();
        const month = createdAt.getMonth();
        const day = createdAt.getDate();

        // Kiểm tra xem dữ liệu có nằm trong tháng và năm hiện tại không
        if (year === currentYear && month === currentMonth) {
            daysCount[day - 1]++; // Tăng số lượng tại ngày tương ứng
        }
    });

    return daysCount;
}


// function countDataByDaysInMonth(data) {

//     const today = new Date();
//     const currentYear = today.getFullYear();
//     const currentMonth = today.getMonth();

//     // Tính tổng số ngày của tháng hiện tại
//     const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

//     // Tạo mảng với độ dài bằng số ngày trong tháng, ban đầu tất cả là 0
//     const daysCount = Array(daysInMonth).fill(0);

//     // Duyệt qua dữ liệu và đếm số lượng cho từng ngày
//     data?.forEach(item => {
//         const createdAt = new Date(item.created_at);
//         const year = createdAt.getFullYear();
//         const month = createdAt.getMonth();
//         const day = createdAt.getDate();

//         // Kiểm tra xem dữ liệu có nằm trong tháng và năm hiện tại không
//         if (year === currentYear && month === currentMonth) {
//             daysCount[day - 1]++; // Tăng số lượng tại ngày tương ứng
//         }
//     });

//     return daysCount;
// }

// function countDataByDaysInMonth(data) {
//     const today = new Date(); // Lấy ngày hiện tại
//     const currentYear = today.getFullYear();
//     const currentMonth = today.getMonth(); // Tháng hiện tại (bắt đầu từ 0)
//     const currentDay = today.getDate(); // Ngày hiện tại (1 - 31)

//     // Tạo mảng với độ dài bằng số ngày tính từ đầu tháng đến ngày hiện tại, ban đầu tất cả là 0
//     const daysCount = Array(currentDay).fill(0);



//     // Duyệt qua dữ liệu và đếm số lượng cho từng ngày
//     data?.forEach(item => {
//         const createdAt = new Date(item.created_at);
//         const year = createdAt.getFullYear();
//         const month = createdAt.getMonth();
//         const day = createdAt.getDate();

//         // Kiểm tra xem dữ liệu có nằm trong tháng và năm hiện tại không
//         if (year === currentYear && month === currentMonth && day <= currentDay) {
//             daysCount[day - 1]++; // Tăng số lượng tại ngày tương ứng
//         }
//     });
// }

function getCurrentMonthDays() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    // Tính ngày cuối cùng của tháng hiện tại
    const lastDay = new Date(year, month + 1, 0).getDate();

    const daysArray = [];

    // Lặp qua tất cả các ngày từ 1 đến ngày cuối cùng của tháng
    for (let day = 1; day <= lastDay; day++) {
        daysArray.push(new Date(year, month, day));
    }

    return daysArray;
}

function convertDurationToMinutes(duration) {
    const timeParts = duration.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);

    return hours * 60 + minutes + seconds / 60;
}

function getTotalTimeDuration(data) {

    const totalMinutes = data?.reduce((total, item) => {
        return total + convertDurationToMinutes(item.duration);
    }, 0); // Khởi tạo giá trị total là 0

    // Làm tròn kết quả đến 2 chữ số thập phân
    if (totalMinutes)
        return parseFloat(totalMinutes.toFixed(2));
    else
        return;
}

function getTotalTimeDurationThisWeek(data) {
    const weekDays = getCurrentWeekDays().map(item => item.date); // Chỉ lấy mảng ngày trong tháng

    const totalMinutes = data?.reduce((total, item) => {
        const date = new Date(item.created_at).getDate(); // Lấy ngày từ item
        if (weekDays.includes(date)) { // So sánh chỉ số ngày trong tháng
            return total + convertDurationToMinutes(item.duration); // Cộng thêm thời gian vào tổng
        }
        return total; // Trả về total nếu không thuộc ngày trong tuần
    }, 0); // Khởi tạo giá trị total là 0

    // Làm tròn kết quả đến 2 chữ số thập phân
    if (totalMinutes)
        return parseFloat(totalMinutes.toFixed(2));
    else
        return;
}

function getAverageTimeDurationThisWeek(data) {
    const weekDays = getCurrentWeekDays().map(item => item.date); // Chỉ lấy mảng ngày trong tháng
    let daysWithData = new Set(); // Sử dụng Set để lưu các ngày có dữ liệu (không trùng lặp)

    const totalMinutes = data?.reduce((total, item) => {
        const date = new Date(item.created_at).getDate(); // Lấy ngày từ item
        if (weekDays.includes(date)) { // So sánh chỉ số ngày trong tháng
            daysWithData.add(date); // Thêm ngày vào Set
            return total + convertDurationToMinutes(item.duration); // Cộng thêm thời gian vào tổng
        }
        return total; // Trả về total nếu không thuộc ngày trong tuần
    }, 0); // Khởi tạo giá trị total là 0

    // Tính số ngày có dữ liệu
    const numberOfDaysWithData = daysWithData.size;

    // Nếu không có dữ liệu thì trả về 0, tránh chia cho 0
    if (numberOfDaysWithData === 0) {
        return 0;
    }

    // Tính trung bình thời gian
    const averageMinutes = totalMinutes / numberOfDaysWithData;

    // Làm tròn kết quả đến 2 chữ số thập phân
    return parseFloat(averageMinutes.toFixed(2));
}


function getCurrentWeekDays() {
    const currentDate = new Date();
    const daysOfWeek = ['Su', 'M', 'T', 'W', 'Th', 'F', 'S']; // Ký hiệu của các ngày trong tuần
    const firstDayOfWeek = currentDate.getDate() - currentDate.getDay(); // Ngày đầu tuần (Chủ nhật)

    const weekDays = [];

    for (let i = 0; i < 7; i++) {
        // Tạo object với 'day' là ký hiệu ngày và 'date' là số ngày trong tháng
        const day = {
            day: daysOfWeek[i],
            date: new Date(currentDate.setDate(firstDayOfWeek + i)).getDate(),
            index: i
        };
        weekDays.push(day);
    }

    return weekDays;
}

// function changeToLbs() {
//     setIsLbs((current) => !current)
// }

function kgToLbs(kg) {
    return kg * 2.20462
}

function calculate1RM(weight, reps, name) {

    if (isNaN(weight) || isNaN(reps)) {
        throw new Error("Weight hoặc Reps không hợp lệ!");
    }

    if (reps == 1) {
        return Number(weight).toFixed(1); // Nếu chỉ có 1 rep, thì 1RM chính là trọng lượng đó
    }
    const oneRepMax = weight * (1 + reps / 30);
    switch (name) {
        case 'Bench Press':
            // Nếu cần điều chỉnh, bạn có thể áp dụng hệ số cho từng bài tập
            return (oneRepMax * 1.0).toFixed(1)
        case 'Deadlift':
            return (oneRepMax * 1.05).toFixed(1)
        case 'Squats':
            return (oneRepMax * 1.03).toFixed(1)
        default:
            throw new Error('Bài tập không hợp lệ!'); // Kiểm tra bài tập hợp lệ
    }
}

// const exportPlanToJSON = async (plan) => {
//     try {
//         const filePath = `${FileSystem.documentDirectory}exercise_plan.json`;

//         // Chuyển dữ liệu thành chuỗi JSON
//         const jsonString = JSON.stringify(plan, null, 2);

//         // Ghi vào file
//         await FileSystem.writeAsStringAsync(filePath, jsonString);

//         console.log(`File đã được lưu tại: ${filePath}`);
//         return filePath;
//     } catch (error) {
//         console.error('Lỗi khi xuất file JSON:', error);
//         throw error;
//     }
// };

const sendJSONByEmail = async (plan) => {
    try {
        const filePath = `${FileSystem.documentDirectory}exercise_plan.json`;
        const jsonString = JSON.stringify(plan, null, 2);

        // Lưu file JSON tạm thời
        await FileSystem.writeAsStringAsync(filePath, jsonString);

        // Gửi email với file đính kèm
        const options = {
            recipients: ['nhpn2003@gmail.com'], // Email của bạn
            subject: 'Exercise Plan',
            body: 'Dưới đây là kế hoạch tập luyện của bạn.',
            attachments: [filePath],
        };

        await MailComposer.composeAsync(options);
        console.log('Email đã được gửi!');
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
    }
};

const generateTrainings = async (userData, exerciseData) => {
    const { _id, gender, level, healthGoal, orm } = userData;

    const getSetsAndReps = () => {
        let sets, reps, kilogram;

        switch (healthGoal) {
            case "Tăng cơ": {
                sets = level === "người mới bắt đầu" ? 3 : level === "trung cấp" ? 4 : 5
                reps = gender === "nam"
                    ? level === "người mới bắt đầu" ? 10 : level === "trung cấp" ? 8 : 6
                    : level === "người mới bắt đầu" ? 12 : level === "trung cấp" ? 10 : 8;

                kilogram = orm * 0.7; // 60-80% ORM
                break;
            }
            case "Giảm mỡ": {
                sets = level === "người mới bắt đầu" ? 3 : 4;
                reps = gender === "nam"
                    ? level === "người mới bắt đầu" ? 15 : level === "trung cấp" ? 17 : 20
                    : level === "người mới bắt đầu" ? 17 : level === "trung cấp" ? 20 : 23;

                kilogram = orm * (0.4 + Math.random() * 0.2); // 40-60% ORM
                break;
            }
            case "Sức mạnh": {
                sets = level === "người mới bắt đầu" ? 3 : level === "trung cấp" ? 4 : 5;

                reps = gender === "nam"
                    ? level === "người mới bắt đầu" ? 8 : level === "trung cấp" ? 6 : 4
                    : level === "người mới bắt đầu" ? 10 : level === "trung cấp" ? 8 : 6;

                kilogram = orm * 0.85; // 85% ORM
                break;
            }
            case "Cân đối tổng thể": {
                sets = level === "người mới bắt đầu" ? 3 : 4;

                reps = gender === "nam"
                    ? level === "người mới bắt đầu" ? 12 : level === "trung cấp" ? 15 : 18
                    : level === "người mới bắt đầu" ? 15 : level === "trung cấp" ? 18 : 21;

                kilogram = orm * 0.6; // 60% ORM
                break;
            }
            default:
                sets = 3;
                reps = 12;
                kilogram = orm * 0.5;
                break;
        }

        return { sets, reps, kilogram: Number(kilogram).toFixed() };
    };


    const trainingTitles = [
        "Tay",
        "Ngực",
        "Lưng",
        "Vai",
        "Chân",
        "Toàn thân",
        "Mông",
        "Thân trên",
        "Bụng",
        "StrongLift A",
        "StrongLift B",
    ];

    const getPopularExercises = (group, limit) => {
        // Lọc các bài tập theo nhóm cơ và sắp xếp theo `population` giảm dần
        const groupExercises = exerciseData
            .filter((exercise) => exercise.bodyPart.toLowerCase() === group)
            .sort((a, b) => b.population - a.population);
        // Chọn tối đa `limit` bài tập
        return groupExercises.slice(0, limit);
    };

    const trainings = trainingTitles.map((title) => {
        let selectedExercises = [];

        if (title === "StrongLift A") {
            selectedExercises = exerciseData.filter((exercise) =>
                ["barbell full squat", "barbell bench press", "barbell bent over row"].includes(exercise.name.toLowerCase())
            );
        }
        else if (title === "StrongLift B") {
            selectedExercises = exerciseData.filter((exercise) =>
                ["barbell full squat", "dumbbell standing alternate overhead press", "barbell deadlift"].includes(exercise.name.toLowerCase())
            );
        }
        else if (title === "Toàn thân") {
            const groups = ["tay", "ngực", "lưng", "vai", "chân", "bụng"];

            selectedExercises = groups.map((group) => {
                // Lấy tất cả bài tập thuộc nhóm cơ, sắp xếp theo population giảm dần
                const groupExercises = exerciseData
                    .filter((exercise) => exercise.bodyPart.toLowerCase() === group)
                    .sort((a, b) => b.population - a.population); // Population giảm dần

                // Chọn bài tập phổ biến nhất hoặc ngẫu nhiên nếu không có bài trong nhóm
                if (groupExercises.length > 0) {
                    return groupExercises[0]; // Chọn bài phổ biến nhất
                } else {
                    // Nếu không có bài trong nhóm cơ, chọn ngẫu nhiên từ tất cả bài tập
                    const fallbackExercises = exerciseData.sort(() => Math.random() - 0.5);
                    return fallbackExercises[0]; // Chọn bài ngẫu nhiên
                }
            });

            while (selectedExercises.length < 6) {
                const randomExercise = exerciseData[Math.floor(Math.random() * exerciseData.length)];
                if (!selectedExercises.includes(randomExercise)) {
                    selectedExercises.push(randomExercise);
                }
            }

        }
        else if (title === "Thân trên") {
            const upperBodyGroups = ["tay", "ngực", "lưng", "vai"];
            selectedExercises = upperBodyGroups
                .map((group) => getPopularExercises(group, 1)) // Chọn bài tập phổ biến nhất của từng nhóm
                .flat();
        }
        else {
            selectedExercises = getPopularExercises(title.toLowerCase(), 6); // Chọn tối đa 6 bài tập
        }

        // Giới hạn bài tập từ 4 đến 6 bài
        const limitedExercises = selectedExercises
            .sort(() => Math.random() - 0.5) // Trộn ngẫu nhiên
            .slice(0, 4 + Math.floor(Math.random() * 3));

        const exercises = limitedExercises.map((exercise) => ({
            // exercise: {
            //     name: exercise.name,
            //     target: exercise.target,
            //     gifUrl: exercise.gifUrl,
            //     id: exercise.id,
            //     bodyPart: exercise.bodyPart,
            //     equipment: exercise.equipment,
            //     instructions: exercise.instructions,
            //     secondaryMuscles: exercise.secondaryMuscles,
            // },
            exercise: exercise._id,
            sets: Array.from({ length: getSetsAndReps().sets }, () => ({
                kilogram: getSetsAndReps().kilogram,
                reps: getSetsAndReps().reps,
                isCheck: false,
            })),
        }));

        return {
            title: title,
            image: images[title.toLowerCase()],
            exercises: exercises,
            user: _id,
        };
    });

    return trainings;
};


export {
    // changeToLbs,
    // exportPlanToJSON,
    generateTrainings,
    sendJSONByEmail,
    // generateExercisePlan,
    createPlansForUser,
    kgToLbs,
    calculate1RM,
    getTotalTimeDurationThisWeek,
    formatDateWithMonth,
    getAverageTimeDurationThisWeek,
    getSortedExercisesByName,
    getCurrentWeekDays,
    getAbbreviation,
    formatDate,
    randomColor,
    formatTime,
    getCurrentMonthDays,
    countDataByDaysInMonth,
    getTotalTimeDuration
}