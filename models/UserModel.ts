export interface UserModel {
    username: string;
    email: string;
    image?: string;
    age?: number;
    isLocked: boolean;
    pushToken?: string;
    clerkId: string;
    role: string;
    gender?: string;
    weight?: number;
    targetWeight?: number;
    bmi?: number;
    targetBMI?: number;
    height?: number;
    focusBodyPart?: string[];
    healthGoal?: string;
    level?: string;
    bmr?: string;
    orm?: number;
    activityLevel?: number;
    tdee?: number;
    daysShouldTraining?: number;
    caloriesPerTraining?: number;
    totalDaysToReachTarget?: number;
    fatRequirement?: number;
    proteinRequirement?: number;
    mealDistribution?: {
        breakfast?: number;
        lunch?: number;
        dinner?: number;
    };
}
