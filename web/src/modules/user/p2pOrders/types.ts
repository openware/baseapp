import { Offer } from "src/modules";

export interface P2POrderCreate {
    offer_id: number;
    amount: number;
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
    dispute: P2PDispute | null;
    user_uid: string;
}

export interface P2PDispute {
    id: string | number;
}
