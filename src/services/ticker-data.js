import yahooFinance from "yahoo-finance2";

const fetchData = async ticker => {
  const quote = await yahooFinance.quote(ticker);
  const { regularMarketPrice: price, currency, marketState } = quote;
  return { price, currency, marketState };
};

export default fetchData;
