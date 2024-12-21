import { Client, Account, ID, Storage } from 'react-native-appwrite';


export const config = {
    endpoint: process.env.EXPO_PUBLIC_ENDPOINT_APPWRITE,
    platform: process.env.EXPO_PUBLIC_PLATFORM_APPWRITE,
    projectId: process.env.EXPO_PUBLIC_PROJECTID_APPWRITE,
    databaseId: process.env.EXPO_PUBLIC_DATABASEID_APPWRITE,
    storageId: process.env.EXPO_PUBLIC_STORAGEID_APPWRITE
}

const client = new Client();
const storage = new Storage(client)

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)

const account = new Account(client);


export const getFilePreview = async (fileId, type) => {
    let fileUrl;
    try {
        if (type === 'video') {
            fileUrl = storage.getFileView(config.storageId, fileId)
        } else if (type === 'image') {
            fileUrl = storage.getFilePreview(config.storageId, fileId, 2000, 2000, 'top', 100)
        } else {
            throw new Error('Invalid file type')
        }

        if (!fileUrl) throw Error;

        return fileUrl
    } catch (error) {
        throw new Error(error)
    }
}

// const listAllFiles = async () => {
//     try {
//         const files = await storage.listFiles(config.storageId);
//         return files.documents; // Trả về danh sách file
//     } catch (error) {
//         console.error('Error listing files:', error);
//         throw new Error(error);
//     }
// };

// export const deleteAllFiles = async () => {
//     try {
//         const files = await listAllFiles();
//         for (const file of files) {
//             await deleteFile(file.$id); // Gọi hàm xóa file
//         }
//         console.log('All files have been deleted successfully.');
//     } catch (error) {
//         console.error('Error deleting all files:', error);
//         throw new Error(error);
//     }
// };

export const deleteFile = async (fileId) => {
    try {
        await storage.deleteFile(config.storageId, fileId);
        console.log(`File with ID ${fileId} has been deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting file with ID ${fileId}:`, error);
        throw new Error(error);
    }
};

const ensureAnonymousSession = async () => {
    const session = await account.getSession('current').catch(() => null);
    if (!session) {
        await account.createAnonymousSession();
    }
};

export const uploadFile = async (file, type) => {
    if (!file) return;

    await ensureAnonymousSession()

    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri
    }

    try {
        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        )


        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return {
            $id: uploadedFile.$id,
            uri: fileUrl,
            fileName: file.fileName,
            fileType: file.mimeType,
            fileSize: file.fileSize,
            type: type
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const createVideo = async (form) => {

    try {
        const uploadedMediaUrls = []
        for (let i = 0; i < form?.medias?.length; i++) {
            const fileUrl = await uploadFile(form?.medias[i], form?.medias[i]?.type)
            uploadedMediaUrls.push(fileUrl)
        }
        return uploadedMediaUrls

    } catch (error) {
        throw new Error(error)
    }
}



