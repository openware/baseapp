import { Label } from '../kyc';

export interface UserProfile {
    first_name: string;
    last_name: string;
    dob: string;
    address: string;
    postcode: string;
    city: string;
    country: string;
    state: string;
    created_at: string;
    updated_at: string;
    metadata?: string;
}

export interface Phone {
    country: string;
    number: string;
    validated_at: string | null;
}

export interface User {
    username?: string;
    email: string;
    level: number;
    otp: boolean;
    role: string;
    state: string;
    uid: string;
    profiles: UserProfile[];
    barong_upload_size_min_range?: number;
    barong_upload_size_max_range?: number;
    csrf_token?: string;
    data?: string;
    referal_uid: string | null;
    labels: Label[];
    phone: Phone[];
    created_at: string;
    updated_at: string;
}
