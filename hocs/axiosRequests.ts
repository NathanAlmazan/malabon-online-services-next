import axios, { AxiosError } from "axios";

type Response = {
    status: number;
    message: string;
    data: unknown | null;
}

export async function apiGetRequest(path: string, accessToken?: string): Promise<Response> {
    try { 
        const config = {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': accessToken ? accessToken : 'anonymous'
            }
        }

        const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URI + path, config);
        
        return { 
            status: response.status, 
            message: "Request success!", 
            data: response.data
        }

    } catch (error) {
        const errorMessage = (error as AxiosError).response?.data.message;
        return {
            status: (error as AxiosError).response?.status as number,
            message: errorMessage as string,
            data: null
        }
    }
}

export async function apiPostRequest(path: string, body: string, accessToken?: string): Promise<Response> {
    try { 
        const config = {
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': accessToken ? accessToken : 'anonymous'
            }
        }

        const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URI + path, body, config);
        
        return { 
            status: response.status, 
            message: "Request success!", 
            data: response.data
        }

    } catch (error) {
        const errorMessage = (error as AxiosError).response?.data.message;
        return {
            status: (error as AxiosError).response?.status as number,
            message: errorMessage as string,
            data: null
        }
    }
}