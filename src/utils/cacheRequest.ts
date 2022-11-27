export function cacheRequest(expireIn: number, fn: () => Promise<any>) {
  let lastTimeFetch: number = 0;
  let cachedResult: any; // cache in memory for simplicity, can use Redis if cache gets bigger

  return async () => {
    console.log("you want me to call");
    const now = new Date().getTime();
    if (lastTimeFetch + expireIn < now) {
      lastTimeFetch = now;
      cachedResult = await fn().catch((err) => err);
    }
    if (cachedResult instanceof Error) throw cachedResult; // can also try to keep calling if last downstream call was failed
    return cachedResult;
  };
}
