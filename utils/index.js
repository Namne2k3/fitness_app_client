
import { images } from '@/constants/image';
import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';
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
        return weight; // Nếu chỉ có 1 rep, thì 1RM chính là trọng lượng đó
    }
    const oneRepMax = weight * (1 + reps / 30);
    switch (name) {
        case 'Bench Press':
            // Nếu cần điều chỉnh, bạn có thể áp dụng hệ số cho từng bài tập
            return (oneRepMax * 1.0)
        case 'Deadlift':
            return (oneRepMax * 1.05)
        case 'Squats':
            return (oneRepMax * 1.03)
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


// day1: thân dưới
// day2: thân trên
// day3: toàn thân
// day4: nghỉ ngơi
// day5: mông
// day6: lưng
// day7: eo
// day8: nghỉ ngơi
// day9: thân dưới
// day10: thân trên
// day11: mông
// day12: nghỉ ngơi,
// day13: toàn thân
// day14: vai
// day15: mông
// day16: nghỉ ngơi
// day17: thân dưới
// day18: thân trên
// day19: toàn thân
// day20: nghỉ ngơi
// day21: mông
// day22: ngực
// day23: lưng
// day24: nghỉ ngơi
// day25: thân dưới
// day26: thân trên
// day27: toàn than
// day28: nghỉ ngơi
// day29: mông
// day30: eo

// const generateExercisePlan = async (user, exercises) => {
//     const { level, focusBodyPart, healthGoal, orm, gender } = user;
//     // focusBodyPart = ["bắp tay", "đùi", "lưng", "eo", "ngực", "vai", "cẳng chân", "cẳng tay", "cardio"]

//     // Hàm xác định số set và reps dựa trên mục tiêu và giới tính
//     const getSetsAndReps = () => {
//         let sets = 3;
//         let reps = 12;

//         if (level === "người mới bắt đầu") {
//             if (healthGoal === "Tăng cơ") {
//                 sets = 3;
//                 reps = gender === "nam" ? 8 + Math.floor(Math.random() * 5) : 10 + Math.floor(Math.random() * 3); // Nam: 8-12, Nữ: 10-12
//             } else if (healthGoal === "Giảm mỡ") {
//                 sets = 3;
//                 reps = 12 + Math.floor(Math.random() * 4); // 12-15
//             } else if (healthGoal === "Sức mạnh") {
//                 sets = 2 + Math.floor(Math.random() * 2); // 2-3 sets
//                 reps = 15 + Math.floor(Math.random() * 6); // 15-20
//             } else if (healthGoal === "Cân đối") {
//                 sets = 2 + Math.floor(Math.random() * 2);
//                 reps = 10 + Math.floor(Math.random() * 3); // 10-12
//             }
//         } else if (level === "trung cấp") {
//             if (healthGoal === "Tăng cơ") {
//                 sets = 4;
//                 reps = gender === "nam" ? 6 + Math.floor(Math.random() * 5) : 8 + Math.floor(Math.random() * 4); // Nam: 6-10, Nữ: 8-12
//             } else if (healthGoal === "Giảm mỡ") {
//                 sets = 3 + Math.floor(Math.random() * 2); // 3-4 sets
//                 reps = 10 + Math.floor(Math.random() * 5); // 10-15
//             } else if (healthGoal === "Sức mạnh") {
//                 sets = 3;
//                 reps = 15 + Math.floor(Math.random() * 6); // 15-20
//             } else if (healthGoal === "Cân đối") {
//                 sets = 3;
//                 reps = 10 + Math.floor(Math.random() * 4); // 10-12
//             }
//         } else if (level === "thâm niên") {
//             if (healthGoal === "Tăng cơ") {
//                 sets = 4 + Math.floor(Math.random() * 2); // 4-5 sets
//                 reps = gender === "nam" ? 4 + Math.floor(Math.random() * 5) : 6 + Math.floor(Math.random() * 5); // Nam: 4-8, Nữ: 6-10
//             } else if (healthGoal === "Giảm mỡ") {
//                 sets = 4;
//                 reps = 8 + Math.floor(Math.random() * 5); // 8-12
//             } else if (healthGoal === "Tăng sức bền") {
//                 sets = 3 + Math.floor(Math.random() * 2); // 3-4 sets
//                 reps = 12 + Math.floor(Math.random() * 9); // 12-20
//             } else if (healthGoal === "Cân đối") {
//                 sets = 3;
//                 reps = 10 + Math.floor(Math.random() * 3); // 10-12
//             }
//         }

//         return { sets, reps };
//     };

//     // Số ngày tập luyện dựa trên giới tính
//     const trainingDaysPerWeek = gender === "nam" ? 6 : 5; // Nam: 6 ngày, Nữ: 5 ngày
//     const totalDays = 30;
//     const exercisesPerDay = 4;

//     // Lọc bài tập phù hợp với user
//     const filteredExercises = exercises.filter(exercise => {
//         const isLevelMatch = exercise.levels.includes(level);
//         const isPurposeMatch = exercise.purposes.includes(healthGoal);
//         const isBodyPartMatch = focusBodyPart.some(part => exercise.bodyPart.includes(part));
//         return isLevelMatch && isPurposeMatch && isBodyPartMatch;
//     });

//     console.log("Check filteredExercises >>> ", filteredExercises.length);

//     const shuffledExercises = filteredExercises.sort(() => Math.random() - 0.5);

//     const plan = [];
//     let dayIndex = 1;

//     for (let i = 0; i < totalDays; i++) {
//         const dayExercises = [];
//         const selectedExercises = new Set(); // Set để theo dõi bài tập đã chọn trong ngày

//         for (let j = 0; j < exercisesPerDay; j++) {
//             let ex;
//             do {
//                 // Lấy bài tập ngẫu nhiên
//                 ex = shuffledExercises[Math.floor(Math.random() * shuffledExercises.length)];
//             } while (selectedExercises.has(ex._id)); // Nếu bài đã chọn, chọn lại

//             // Đánh dấu bài tập là đã chọn
//             selectedExercises.add(ex._id);

//             const { sets, reps } = getSetsAndReps();
//             dayExercises.push({
//                 exercise: {
//                     _id: ex._id,
//                     id: ex.id,
//                     name: ex.name,
//                     target: ex.target,
//                     gifUrl: ex.gifUrl,
//                     bodyPart: ex.bodyPart,
//                     equipment: ex.equipment,
//                     instructions: ex.instructions,
//                     secondaryMuscles: ex.secondaryMuscles,
//                 },
//                 sets: Array.from({ length: sets }, () => ({
//                     kilogram: orm ? orm * 0.7 : 0, // Nếu có ORM, sử dụng 70%
//                     reps: reps,
//                     isCheck: false,
//                 })),
//             });
//         }

//         plan.push({
//             title: `Ngày ${dayIndex}`,
//             exercises: dayExercises
//         });
//         dayIndex++;
//     }

//     return plan;
// };

// const generateTrainings = async (userData, exerciseData) => {
//     const { gender, level, healthGoal } = userData;

//     // Hàm tính toán sets và reps đã cho
//     const getSetsAndReps = () => {
//         let sets = 3;
//         let reps = 12;

//         if (level === "người mới bắt đầu") {
//             if (healthGoal === "Tăng cơ") {
//                 sets = 3;
//                 reps = gender === "nam" ? 8 + Math.floor(Math.random() * 5) : 10 + Math.floor(Math.random() * 3); // Nam: 8-12, Nữ: 10-12
//             } else if (healthGoal === "Giảm mỡ") {
//                 sets = 3;
//                 reps = 12 + Math.floor(Math.random() * 4); // 12-15
//             } else if (healthGoal === "Tăng sức bền") {
//                 sets = 2 + Math.floor(Math.random() * 2); // 2-3 sets
//                 reps = 15 + Math.floor(Math.random() * 6); // 15-20
//             } else if (healthGoal === "Cải thiện sức khỏe tổng thể") {
//                 sets = 2 + Math.floor(Math.random() * 2);
//                 reps = 10 + Math.floor(Math.random() * 3); // 10-12
//             }
//         } else if (level === "trung cấp") {
//             if (healthGoal === "Tăng cơ") {
//                 sets = 4;
//                 reps = gender === "nam" ? 6 + Math.floor(Math.random() * 5) : 8 + Math.floor(Math.random() * 4); // Nam: 6-10, Nữ: 8-12
//             } else if (healthGoal === "Giảm mỡ") {
//                 sets = 3 + Math.floor(Math.random() * 2); // 3-4 sets
//                 reps = 10 + Math.floor(Math.random() * 5); // 10-15
//             } else if (healthGoal === "Tăng sức bền") {
//                 sets = 3;
//                 reps = 15 + Math.floor(Math.random() * 6); // 15-20
//             } else if (healthGoal === "Cải thiện sức khỏe tổng thể") {
//                 sets = 3;
//                 reps = 10 + Math.floor(Math.random() * 4); // 10-12
//             }
//         } else if (level === "thâm niên") {
//             if (healthGoal === "Tăng cơ") {
//                 sets = 4 + Math.floor(Math.random() * 2); // 4-5 sets
//                 reps = gender === "nam" ? 4 + Math.floor(Math.random() * 5) : 6 + Math.floor(Math.random() * 5); // Nam: 4-8, Nữ: 6-10
//             } else if (healthGoal === "Giảm mỡ") {
//                 sets = 4;
//                 reps = 8 + Math.floor(Math.random() * 5); // 8-12
//             } else if (healthGoal === "Tăng sức bền") {
//                 sets = 3 + Math.floor(Math.random() * 2); // 3-4 sets
//                 reps = 12 + Math.floor(Math.random() * 9); // 12-20
//             } else if (healthGoal === "Cải thiện sức khỏe tổng thể") {
//                 sets = 3;
//                 reps = 10 + Math.floor(Math.random() * 3); // 10-12
//             }
//         }

//         return { sets, reps };
//     };

//     // Danh sách training cần tạo
//     const trainingTitles = [
//         "Tay",
//         "Ngực",
//         "Lưng",
//         "Vai",
//         "Chân",
//         "Toàn thân",
//         "Thân trên",
//         "Bụng",
//         "StrongLift A",
//         "StrongLift B",
//     ];

//     // Tạo danh sách bài tập
//     const trainings = trainingTitles.map((title) => {
//         const selectedExercises = exerciseData.filter((exercise) => {
//             // Chọn bài tập theo logic riêng cho từng title
//             if (title === "StrongLift A") {
//                 return ["barbell full squat", "barbell bench press", "barbell bent over row"].includes(exercise.name.toLowerCase());
//             } else if (title === "StrongLift B") {
//                 return ["barbell full squat", "dumbbell standing alternate overhead press", "barbell deadlift"].includes(exercise.name.toLowerCase());
//             }
//             // Với các bài tập thông thường, chọn bài theo bodyPart dựa trên title
//             return exercise.bodyPart.toLowerCase() === title.toLowerCase();
//         });

//         // Giới hạn từ 4 đến 6 bài tập
//         const limitedExercises = selectedExercises
//             .sort(() => Math.random() - 0.5) // Trộn ngẫu nhiên danh sách
//             .slice(0, 4 + Math.floor(Math.random() * 3)); // Lấy từ 4 đến 6 bài tập

//         // Tạo danh sách exercises với sets và reps
//         const exercises = limitedExercises.map((exercise) => ({
//             exercise: {
//                 name: exercise.name,
//                 target: exercise.target,
//                 gifUrl: exercise.gifUrl,
//                 id: exercise.id,
//                 bodyPart: exercise.bodyPart,
//                 equipment: exercise.equipment,
//                 instructions: exercise.instructions,
//                 secondaryMuscles: exercise.secondaryMuscles,
//             },
//             sets: Array.from({ length: getSetsAndReps().sets }, () => ({
//                 kilogram: 0,
//                 reps: getSetsAndReps().reps,
//                 isCheck: false,
//             })),
//         }));

//         return {
//             title,
//             exercises,
//             user: userData.id, // Giả định bạn có `user.id`
//         };
//     });

//     return trainings;
// };

// ham nay hoat dong tot
// const generateTrainings = async (userData, exerciseData) => {
//     const { _id, gender, level, healthGoal } = userData;

//     const getSetsAndReps = () => {
//         let sets = 3;
//         let reps = 12;

//         if (level === "người mới bắt đầu") {
//             if (healthGoal === "Tăng cơ") {
//                 sets = 3;
//                 reps = gender === "nam" ? 8 + Math.floor(Math.random() * 5) : 10 + Math.floor(Math.random() * 3);
//             } else if (healthGoal === "Giảm mỡ") {
//                 sets = 3;
//                 reps = 12 + Math.floor(Math.random() * 4);
//             } else if (healthGoal === "Tăng sức bền") {
//                 sets = 2 + Math.floor(Math.random() * 2);
//                 reps = 15 + Math.floor(Math.random() * 6);
//             } else if (healthGoal === "Cải thiện sức khỏe tổng thể") {
//                 sets = 2 + Math.floor(Math.random() * 2);
//                 reps = 10 + Math.floor(Math.random() * 3);
//             }
//         } else if (level === "trung cấp") {
//             if (healthGoal === "Tăng cơ") {
//                 sets = 4;
//                 reps = gender === "nam" ? 6 + Math.floor(Math.random() * 5) : 8 + Math.floor(Math.random() * 4);
//             } else if (healthGoal === "Giảm mỡ") {
//                 sets = 3 + Math.floor(Math.random() * 2);
//                 reps = 10 + Math.floor(Math.random() * 5);
//             } else if (healthGoal === "Tăng sức bền") {
//                 sets = 3;
//                 reps = 15 + Math.floor(Math.random() * 6);
//             } else if (healthGoal === "Cải thiện sức khỏe tổng thể") {
//                 sets = 3;
//                 reps = 10 + Math.floor(Math.random() * 4);
//             }
//         } else if (level === "thâm niên") {
//             if (healthGoal === "Tăng cơ") {
//                 sets = 4 + Math.floor(Math.random() * 2);
//                 reps = gender === "nam" ? 4 + Math.floor(Math.random() * 5) : 6 + Math.floor(Math.random() * 5);
//             } else if (healthGoal === "Giảm mỡ") {
//                 sets = 4;
//                 reps = 8 + Math.floor(Math.random() * 5);
//             } else if (healthGoal === "Tăng sức bền") {
//                 sets = 3 + Math.floor(Math.random() * 2);
//                 reps = 12 + Math.floor(Math.random() * 9);
//             } else if (healthGoal === "Cải thiện sức khỏe tổng thể") {
//                 sets = 3;
//                 reps = 10 + Math.floor(Math.random() * 3);
//             }
//         }

//         return { sets, reps };
//     };

//     const trainingTitles = [
//         "Tay",
//         "Ngực",
//         "Lưng",
//         "Vai",
//         "Chân", // Thay đổi "Thân dưới" thành "Chân"
//         "Toàn thân",
//         "Thân trên",
//         "Bụng",
//         "StrongLift A",
//         "StrongLift B",
//     ];

//     const trainings = trainingTitles.map((title) => {
//         let selectedExercises = [];

//         if (title === "StrongLift A") {
//             selectedExercises = exerciseData.filter((exercise) =>
//                 ["barbell full squat", "barbell bench press", "barbell bent over row"].includes(exercise.name.toLowerCase())
//             );
//         } else if (title === "StrongLift B") {
//             selectedExercises = exerciseData.filter((exercise) =>
//                 ["barbell full squat", "dumbbell standing alternate overhead press", "barbell deadlift"].includes(exercise.name.toLowerCase())
//             );
//         } else if (title === "Toàn thân") {
//             // Chọn 1 bài tập từ mỗi nhóm cơ
//             const groups = ["tay", "ngực", "lưng", "vai", "chân", "bụng"];
//             selectedExercises = groups.map((group) => {
//                 const groupExercises = exerciseData.filter(
//                     (exercise) => exercise.bodyPart.toLowerCase() === group
//                 );
//                 return groupExercises[6];
//             });
//         } else if (title === "Thân trên") {
//             // Ngẫu nhiên chọn từ tay, ngực, lưng, vai
//             const upperBodyGroups = ["tay", "ngực", "lưng", "vai"];
//             selectedExercises = exerciseData.filter((exercise) =>
//                 upperBodyGroups.includes(exercise.bodyPart.toLowerCase())
//             );
//         } else {
//             selectedExercises = exerciseData.filter(
//                 (exercise) => exercise.bodyPart.toLowerCase() === title.toLowerCase()
//             );
//         }

//         // Giới hạn bài tập từ 4 đến 6 bài
//         const limitedExercises = selectedExercises
//             .sort(() => Math.random() - 0.5)
//             .slice(0, 4 + Math.floor(Math.random() * 3));

//         const exercises = limitedExercises.map((exercise) => ({
//             exercise: {
//                 name: exercise.name,
//                 target: exercise.target,
//                 gifUrl: exercise.gifUrl,
//                 id: exercise.id,
//                 bodyPart: exercise.bodyPart,
//                 equipment: exercise.equipment,
//                 instructions: exercise.instructions,
//                 secondaryMuscles: exercise.secondaryMuscles,
//             },
//             sets: Array.from({ length: getSetsAndReps().sets }, () => ({
//                 kilogram: 0,
//                 reps: getSetsAndReps().reps,
//                 isCheck: false,
//             })),
//         }));

//         return {
//             title: title,
//             image: images[title.toLowerCase()],
//             exercises: exercises,
//             user: _id,
//         };
//     });

//     return trainings;
// };

const generateTrainings = async (userData, exerciseData) => {
    const { _id, gender, level, healthGoal, orm } = userData;

    const getSetsAndReps = () => {
        let sets, reps, kilogram;

        switch (healthGoal) {
            case "Tăng cơ": {
                sets = level === "người mới bắt đầu" ? 3 : level === "trung cấp" ? 4 : 5;
                reps = gender === "nam"
                    ? level === "người mới bắt đầu"
                        ? 8 + Math.floor(Math.random() * 3) // Nam: Beginner: 8-10 reps
                        : level === "trung cấp"
                            ? 6 + Math.floor(Math.random() * 3) // Nam: Intermediate: 6-8 reps
                            : 4 + Math.floor(Math.random() * 3) // Nam: Advanced: 4-6 reps
                    : level === "người mới bắt đầu"
                        ? 10 + Math.floor(Math.random() * 3) // Nữ: Beginner: 10-12 reps
                        : level === "trung cấp"
                            ? 8 + Math.floor(Math.random() * 3) // Nữ: Intermediate: 8-10 reps
                            : 6 + Math.floor(Math.random() * 3); // Nữ: Advanced: 6-8 reps;
                kilogram = orm ? orm * (0.6 + Math.random() * 0.2) : 0; // 60-80% ORM
                break;
            }
            case "Giảm mỡ": {
                sets = level === "người mới bắt đầu" ? 3 : level === "trung cấp" ? 4 : 4;
                reps = gender === "nam"
                    ? level === "người mới bắt đầu"
                        ? 12 + Math.floor(Math.random() * 4) // Nam: Beginner: 12-15 reps
                        : level === "trung cấp"
                            ? 15 + Math.floor(Math.random() * 3) // Nam: Intermediate: 15-17 reps
                            : 18 + Math.floor(Math.random() * 3) // Nam: Advanced: 18-20 reps
                    : level === "người mới bắt đầu"
                        ? 15 + Math.floor(Math.random() * 3) // Nữ: Beginner: 15-17 reps
                        : level === "trung cấp"
                            ? 18 + Math.floor(Math.random() * 3) // Nữ: Intermediate: 18-20 reps
                            : 20 + Math.floor(Math.random() * 3); // Nữ: Advanced: 20-23 reps
                kilogram = orm ? orm * (0.4 + Math.random() * 0.2) : 0; // 40-60% ORM
                break;
            }
            case "Sức mạnh": {
                sets = level === "người mới bắt đầu" ? 3 : level === "trung cấp" ? 4 : 5;
                reps = gender === "nam"
                    ? level === "người mới bắt đầu"
                        ? 6 + Math.floor(Math.random() * 2) // Nam: Beginner: 6-8 reps
                        : level === "trung cấp"
                            ? 4 + Math.floor(Math.random() * 2) // Nam: Intermediate: 4-6 reps
                            : 2 + Math.floor(Math.random() * 2) // Nam: Advanced: 2-4 reps
                    : level === "người mới bắt đầu"
                        ? 8 + Math.floor(Math.random() * 2) // Nữ: Beginner: 8-10 reps
                        : level === "trung cấp"
                            ? 6 + Math.floor(Math.random() * 2) // Nữ: Intermediate: 6-8 reps
                            : 4 + Math.floor(Math.random() * 2); // Nữ: Advanced: 4-6 reps
                kilogram = orm ? orm * (0.7 + Math.random() * 0.2) : 0; // 70-90% ORM
                break;
            }
            case "Cân đối": {
                sets = level === "người mới bắt đầu" ? 2 : 3;
                reps = gender === "nam"
                    ? level === "người mới bắt đầu"
                        ? 10 + Math.floor(Math.random() * 3) // Nam: Beginner: 10-12 reps
                        : level === "trung cấp"
                            ? 12 + Math.floor(Math.random() * 3) // Nam: Intermediate: 12-15 reps
                            : 15 + Math.floor(Math.random() * 3) // Nam: Advanced: 15-18 reps
                    : level === "người mới bắt đầu"
                        ? 12 + Math.floor(Math.random() * 3) // Nữ: Beginner: 12-15 reps
                        : level === "trung cấp"
                            ? 15 + Math.floor(Math.random() * 3) // Nữ: Intermediate: 15-18 reps
                            : 18 + Math.floor(Math.random() * 3); // Nữ: Advanced: 18-21 reps
                kilogram = orm ? orm * (0.5 + Math.random() * 0.1) : 0; // 50-60% ORM
                break;
            }
            default:
                sets = 3;
                reps = 12;
                kilogram = orm ? orm * 0.5 : 0;
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
            exercise: {
                name: exercise.name,
                target: exercise.target,
                gifUrl: exercise.gifUrl,
                id: exercise.id,
                bodyPart: exercise.bodyPart,
                equipment: exercise.equipment,
                instructions: exercise.instructions,
                secondaryMuscles: exercise.secondaryMuscles,
            },
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