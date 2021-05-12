/**
 * converts snake_case to display label
 * eg) custom_field -> Custom field
 */
export const titleCase = (key: string): string => {
    let s = key.split('_');

    s[0] = s[0].substring(0, 1)?.toUpperCase() + s[0].substring(1);

    return s.join(' ');
};
