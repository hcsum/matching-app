import { TradingInfo } from "..";
import { parseResponse } from "./parseResponse";

export const mockDownstreamTradingInfo = {
  data: [
    {
      id: "bitcoin",
      rank: "1",
      symbol: "BTC",
      name: "Bitcoin",
      supply: "19107912.0000000000000000",
      maxSupply: "21000000.0000000000000000",
      marketCapUsd: "451441770000.0250472598829200",
      volumeUsd24Hr: "11737140069.4770785663788676",
      priceUsd: "23625.9079484992942850",
      changePercent24Hr: "-1.1572166216282494",
      vwap24Hr: "24209.5602521169138777",
      explorer: "https://blockchain.info/",
    },
    {
      id: "ethereum",
      rank: "2",
      symbol: "ETH",
      name: "Ethereum",
      supply: "121764437.9365000000000000",
      maxSupply: null,
      marketCapUsd: "206311240449.0021532094307437",
      volumeUsd24Hr: "7321899029.8515217837892281",
      priceUsd: "1694.3472490432157501",
      changePercent24Hr: "-2.9359394769662596",
      vwap24Hr: "1714.3014862411350481",
      explorer: "https://etherscan.io/",
    },
    {
      id: "xrp",
      rank: "8",
      symbol: "XRP",
      name: "XRP",
      supply: "45404028640.0000000000000000",
      maxSupply: "100000000000.0000000000000000",
      marketCapUsd: "17575121444.7669078840349440",
      volumeUsd24Hr: "583495886.0300111843286796",
      priceUsd: "0.3870828640365096",
      changePercent24Hr: "4.4233623776197440",
      vwap24Hr: "0.3889684614811875",
      explorer: "https://xrpcharts.ripple.com/#/graph/",
    },
    {
      id: "dogecoin",
      rank: "11",
      symbol: "DOGE",
      name: "Dogecoin",
      supply: "132670764299.8940900000000000",
      maxSupply: null,
      marketCapUsd: "9217012793.2768803628179709",
      volumeUsd24Hr: "277292717.3728564858814411",
      priceUsd: "0.0694728250184976",
      changePercent24Hr: "-0.1015933968498246",
      vwap24Hr: "0.0711977782042312",
      explorer: "http://dogechain.info/chain/Dogecoin",
    },
    {
      id: "litecoin",
      rank: "22",
      symbol: "LTC",
      name: "Litecoin",
      supply: "70835268.7774209800000000",
      maxSupply: "84000000.0000000000000000",
      marketCapUsd: "4273292048.4253727818329349",
      volumeUsd24Hr: "207250913.8868744788002960",
      priceUsd: "60.3271805441006726",
      changePercent24Hr: "-1.8205713987652972",
      vwap24Hr: "62.0393689910719184",
      explorer: "http://explorer.litecoin.net/chain/Litecoin",
    },
    {
      id: "monero",
      rank: "28",
      symbol: "XMR",
      name: "Monero",
      supply: "18154530.7728029800000000",
      maxSupply: null,
      marketCapUsd: "2830709297.0223857147442396",
      volumeUsd24Hr: "47307244.2832382329280129",
      priceUsd: "155.9230217760861799",
      changePercent24Hr: "-3.4128668852656507",
      vwap24Hr: "160.5996542748365571",
      explorer: "http://moneroblocks.info/",
    },
    {
      id: "dash",
      rank: "76",
      symbol: "DASH",
      name: "Dash",
      supply: "10844278.6768695300000000",
      maxSupply: "18900000.0000000000000000",
      marketCapUsd: "552825815.0844941800923755",
      volumeUsd24Hr: "49449670.2281514651895717",
      priceUsd: "50.9785695809950416",
      changePercent24Hr: "-0.8112455324698882",
      vwap24Hr: "52.0325171567147658",
      explorer: "https://explorer.dash.org",
    },
  ],
  timestamp: 1659224985439,
};

export const mockApiCall = (): Promise<TradingInfo[]> => {
  // return Promise.reject(new Error("bad"));
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = mockDownstreamTradingInfo.data.map((info) => ({
        ...info,
        priceUsd: Number(info.priceUsd) * Math.random() * 10 + "",
      }));
      resolve(
        parseResponse({ data, timestamp: mockDownstreamTradingInfo.timestamp })
      );
    }, 200);
  });
};
