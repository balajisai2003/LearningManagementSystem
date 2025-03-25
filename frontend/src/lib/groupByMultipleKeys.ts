type AnyObject = { [key: string]: any };

/**
 * Groups an array of objects by one or more keys.
 * @param array - The array of objects to group.
 * @param keys - The keys to group by (in order of nesting).
 * @returns Grouped object or array based on the keys.
 */
export const groupByMultipleKeys = <T extends AnyObject>(
    array: T[],
    keys: string[]
): any => {
    if (!keys.length) return array;

    const [currentKey, ...remainingKeys] = keys;

    const grouped = array.reduce((acc, item) => {
        const groupValue = item[currentKey] ?? "Undefined";

        if (!acc[groupValue]) {
            acc[groupValue] = [];
        }

        acc[groupValue].push(item);

        return acc;
    }, {} as Record<string, T[]>);

    // Recursively group by the remaining keys
    const result = Object.entries(grouped).map(([key, items]) => ({
        [currentKey]: key,
        ...(remainingKeys.length
            ? { children: groupByMultipleKeys(items, remainingKeys) }
            : { items }),
    }));

    return result;
};
