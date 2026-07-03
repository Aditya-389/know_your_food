
/*
In API response data can be of different types
 it can be -> users, products, token (login) etc
 that's why we are using generics 
 
And for errors : Almost every error looks similar 

*/

export interface ApiSuccessResponse<T = unknown> {
    success: true;
    message: string;
    data?: T;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    error?: unknown;
}

export const apiSuccess = <T>(message: string, data?: T): ApiSuccessResponse<T> => ({
    success: true,
    message,
    data,
});

export const ApiErrorResponse = (message: string, error?: unknown): ApiErrorResponse => ({
    success: false,
    message,
    error,
});