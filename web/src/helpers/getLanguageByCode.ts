export const getLanguageName = (code: string) => {
    switch (code) {
        case 'en':
            return 'English';
        case 'ru':
            return 'Русский';
        case 'zh':
            return '中国';
        default:
            return 'English';
    }
};
