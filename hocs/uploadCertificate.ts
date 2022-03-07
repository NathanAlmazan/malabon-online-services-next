import { FirebaseStorage } from './FirebaseProvider';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default async function uploadCertificateToFirebase(file: File, fileName: string): Promise<string | null> {

    const storageRef = ref(FirebaseStorage, `certificates/${fileName}`);

    const uploadFile = await uploadBytes(storageRef, file);
    const uploadURL = await getDownloadURL(uploadFile.ref);
    
    return uploadURL;
}