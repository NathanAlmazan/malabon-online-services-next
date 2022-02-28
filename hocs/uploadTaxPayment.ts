import { FirebaseStorage } from './FirebaseProvider';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default async function uploadTOPToFirebase(uid: string, file: File, fileName: string): Promise<string | null> {

    const storageRef = ref(FirebaseStorage, `TaxOrderOfPayment/${uid}/${fileName}`);

    const uploadFile = await uploadBytes(storageRef, file);
    const uploadURL = await getDownloadURL(uploadFile.ref);
    
    return uploadURL;
}