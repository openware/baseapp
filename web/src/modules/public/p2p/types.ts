import { UserPaymentMethod } from "src/modules";

export interface Offer {
    id: number;
    price: string | number;
    available_amount: string | number;
    origin_amount: string | number;
    min_order_amount: string | number;
    max_order_amount: string | number;
    base: string;
    quote: string;
    state: string;
    side: string;
    created_at: string;
    time_limit: number;
    description?: string;
    payment_methods: UserPaymentMethod[];
    user: {
        user_nickname: string;
        offers_count: string | number;
        success_rate: string | number;
    };
}

export interface P2PCurrency {
    id: string;
    type: string;
    enabled: boolean;
}

export interface PaymentMethod {
    id: number;
    type: string;
    name: string;
    options?: any;
}
