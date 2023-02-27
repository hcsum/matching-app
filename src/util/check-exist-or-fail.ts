export function checkExistOrFail<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) {
    throw new Error("VALUE_NOT_FOUND");
  }

  return value;
}
