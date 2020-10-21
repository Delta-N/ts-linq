/**
 * Groups elements in a given array for a given key
 * @param array Array to group
 * @param keySelector Function which selects a key to groupby in type T
 */
export function groupBy<T, K>(array: T[], keySelector: (current: T) => K): Map<K, T[]> {
  return array.reduce((previous: Map<K, T[]>, current: T) => {
    if (previous.has(keySelector(current))) {
      previous.get(keySelector(current)).push(current);
    } else {
      previous.set(keySelector(current), [current]);
    }
    return previous;
  }, new Map<K, T[]>());
}

/**
 * Groups elements in a given array with contiguous keys
 * @param array Array to group
 * @param keySelector Function which selects a key to groupby in type T
 */
export function groupByContiguousKey<T, K>(
  array: T[],
  keySelector: (current: T) => K
): Map<KeyIndex<K>, T[]> {
  let resultMap = new Map<KeyIndex<K>, T[]>();

  // Reduce the array, this reduce function in comparable to the groupby function.
  array
    .reduce((previous: Map<string, T[]>, current: T, index: number) => {
      // String version of last element
      const lastKey = JSON.stringify({
        key: keySelector(current),
        index: index - 1,
      });
      // String verion of current element
      const currentKey = JSON.stringify({
        key: keySelector(current),
        index: index,
      });
      // Check whether the map has a key with the same key and index - 1 (so the last element should have had the same key.)
      if (previous.has(lastKey)) {
        // Copy over the values from last key to current key
        previous.set(currentKey, previous.get(lastKey));
        // Append current
        previous.get(currentKey).push(current);
        // Remove the last key, as this key will no longer be used and is now stored in the current key.
        previous.delete(lastKey);
      } else {
        // If key didnt exist, create it.
        previous.set(currentKey, [current]);
      }
      return previous;
    }, new Map<string, T[]>())
    // Map the values back to 'proper' objects
    .forEach((values: T[], key: string) => {
      resultMap.set(JSON.parse(key), values);
    });

  return resultMap;
}

/**
 * Simple wrapper type for the grouping.
 */
export interface KeyIndex<K> {
  key: K;
  index: number;
}
