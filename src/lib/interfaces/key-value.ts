export interface KeyValuePair<TKey = string, TValue = any> {
    key: TKey;
    value: TValue;
}

export interface KeyBooleanPair extends KeyValuePair<string, boolean> {}
export interface KeyStringPair extends KeyValuePair<string, string> {}
