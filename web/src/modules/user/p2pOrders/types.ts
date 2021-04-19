import { Offer } from "src/modules";
import { UserPaymentMethod } from "../paymentMethod";

export interface P2POrderCreate {
    offer_id: number;
    amount: string;
    side: string;
}

export interface P2POrder {
    id: number;
    offer: Offer;
    amount: number;
    first_approve_expire_at: string;
    second_approve_expire_at: string;
    side: string;
    created_at: string;
    state: string;
    user_uid: string;
    payment_method?: UserPaymentMethod;
    payment_method_id?: number; // payment method to which another user has sent money
}
