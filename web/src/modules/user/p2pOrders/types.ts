import { Offer } from "src/modules";
import { UserPaymentMethod } from "../paymentMethod";

export interface P2POrderCreate {
    offer_id: number;
    amount: string;
    side: string;
    payment_method_id?: number;
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
    payment_method?: UserPaymentMethod; // payment method to which current user should send money (for sell orders state prepared for maker)
    payment_method_id?: number; // payment method to which another user has sent money (for buy orders in wait state for maker)
}
