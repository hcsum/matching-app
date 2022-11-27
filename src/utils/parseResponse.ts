import { TradingInfo } from "..";

type Response = {
  data: {
    id: string;
    rank: string;
    symbol: string;
    name: string;
    supply: string;
    maxSupply: string | null;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    priceUsd: string;
    changePercent24Hr: string;
    vwap24Hr: string;
  }[];
  timestamp: number;
};

export function parseResponse(res: Response): TradingInfo[] {
  const { data } = res;
  return data.map(({ name, volumeUsd24Hr, changePercent24Hr, priceUsd }) => {
    return {
      name,
      volumeUsd24Hr: toFixedString(volumeUsd24Hr),
      changePercent24Hr: toFixedString(changePercent24Hr),
      priceUsd: "$" + toFixedString(priceUsd),
    };
  });
}

function toFixedString(str: string) {
  return Number(str).toFixed(8).toString();
}
