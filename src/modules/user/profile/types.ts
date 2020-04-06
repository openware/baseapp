
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

export interface UserDocument {
    upload: {
        url: string;
    };
    doc_type: string;
    doc_number: string;
    doc_expire: string;
    created_at?: string;
    updated_at?: string;
}

export interface User {
    email: string;
    level: number;
    otp: boolean;
    role: string;
    state: string;
    uid: string;
    profiles: UserProfile[];
    documents: UserDocument[];
    csrf_token?: string;
}
