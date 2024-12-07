import request from '@/utils/request';
import { END_POINT } from './api';

export function login(credentials) {
    return request.post(END_POINT.LOGIN, credentials);
}

export function register(credentials) {
    return request.post(END_POINT.REGISTER, credentials);
}

export function forgetPassword(email) {
    return request.post(END_POINT.FORGET_PASSWORD, { email });
}

export function confirmPassword(data) {
    return request.post(END_POINT.CONFIRM_PASSWORD, data);
}