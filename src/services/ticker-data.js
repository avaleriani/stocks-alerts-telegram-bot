import yahooFinance from "yahoo-finance2";

const fetchData = async ticker => {
  return await yahooFinance.quote(ticker);
};

export default fetchData;
