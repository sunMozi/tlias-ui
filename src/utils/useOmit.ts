/**
 * 从对象中排除指定字段，返回新的对象副本
 * @param obj 原始对象
 * @param keys 要排除的字段名数组
 * @returns 排除字段后的新对象
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj }
  keys.forEach((key) => {
    delete result[key]
  })
  return result
}
