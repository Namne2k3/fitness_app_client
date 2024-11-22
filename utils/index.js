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



export {
    // changeToLbs,
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