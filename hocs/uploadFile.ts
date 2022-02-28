import { FirebaseStorage } from './FirebaseProvider';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default async function uploadFileToFirebase(uid: string, file: File, fileName: string): Promise<string | undefined> {

    const storageRef = ref(FirebaseStorage, `documents/${uid}/${fileName}`);

    const uploadFile = await uploadBytes(storageRef, file);
    const uploadURL = await getDownloadURL(uploadFile.ref);
    
    return uploadURL;
}