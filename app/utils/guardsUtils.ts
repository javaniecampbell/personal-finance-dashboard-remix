// create a method to check if value is Empty, string, number, array or object
export function isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) {
        return true;
    }
    if (typeof value === 'string') {
        return value.trim().length === 0;
    }
    if (typeof value === 'number') {
        return value !== 0;
    }
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    if (typeof value === 'object') {
        return Object.keys(value).length === 0;
    }
    return false;
}
