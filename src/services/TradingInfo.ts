import fetch from "node-fetch";
import { parseResponse } from "../utils/parseResponse";

export function getTradingInfo() {
  return (
    fetch(
      "https://api.coincap.io/v2/assets?ids=bitcoin,ethereum,litecoin,monero,xrp,dogecoin,dash"
    )
      .then((res) => res.json())
      .then(parseResponse)
      // this catch is unnecessary, but can be useful if want to log the error here.
      .catch((err) => {
        throw err;
      })
  );
}
