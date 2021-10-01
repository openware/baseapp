export interface BeneficiaryCrypto {
    address: string;
}

export interface BeneficiaryBank {
    address?: string;
    country?: string;
    full_name: string;
    account_number?: string;
    account_type?: string;
    bank_name?: string;
    bank_address?: string;
    bank_country?: string;
    bank_swift_code?: string;
    intermediary_bank_name?: string;
    intermediary_bank_address?: string;
    intermediary_bank_country?: string;
    intermediary_bank_swift_code?: string;
}

export interface Beneficiary {
    id: number;
    currency: string;
    name: string;
    blockchain_key: string;
    blockchain_name: string;
    protocol?: string;
    state: string;
    description?: string;
    data: BeneficiaryCrypto | BeneficiaryBank;
}
