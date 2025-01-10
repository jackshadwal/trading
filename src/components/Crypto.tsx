import { useState, useEffect } from "react";
import axios from "axios";
import TradingViewWidget from "./TradingViewWidget";

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: {
      inr: number;
      usd: number;
    };
    price_change_percentage_24h: number;
  };
  market_cap_rank: number;
  image: {
    small: string;
  };
}

interface CryptoProps {
  coinId: string;
}

function Crypto({ coinId = "bitcoin" }: CryptoProps): JSX.Element {
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<CryptoData>(
          `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
        );
        setCryptoData(response.data);
      } catch (error) {
        console.error("Error fetching coin data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [coinId]);

  if (!cryptoData) return <div>Loading...</div>;

  return (
    <div className="bg-white h-max rounded-lg my-5 p-6">
      <div className="flex items-center">
        <div>
          <img
            src={cryptoData.image.small}
            className="w-9"
            alt={cryptoData.name}
          />
        </div>
        <div className="text-2xl font-semibold text-[#0B1426] pl-2">
          {cryptoData.name}
        </div>
        <div className="text-sm text-[#5D667B] pl-2">
          {cryptoData.symbol.toUpperCase()}
        </div>
        <div className="bg-[#808A9D] px-3 py-2 text-white rounded-lg ml-7">
          Rank #{cryptoData.market_cap_rank}
        </div>
      </div>
      <div className="mt-8 flex">
        <div>
          <div className="text-3xl font-semibold text-[#0B1426]">
            ${cryptoData.market_data.current_price.usd.toLocaleString()}
          </div>
          <div className="text-lg font-medium text-[#0B1426]">
            ₹{cryptoData.market_data.current_price.inr.toLocaleString()}
          </div>
        </div>
        <div
          className={`flex items-center justify-center rounded-lg p-2 h-10 ml-10 ${
            cryptoData.market_data.price_change_percentage_24h < 0
              ? "bg-red-300/20"
              : "bg-green-300/20"
          }`}
        >
          <svg
            viewBox="0 0 100 100"
            className={`w-4 fill-current ${
              cryptoData.market_data.price_change_percentage_24h < 0
                ? "text-red-600 rotate-180"
                : "text-green-600"
            }`}
          >
            <polygon points="0,100 50,0 100,100" />
          </svg>
          <span
            className={`ml-2 text-sm font-bold ${
              cryptoData.market_data.price_change_percentage_24h < 0
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {Math.abs(
              cryptoData.market_data.price_change_percentage_24h
            ).toFixed(2)}
            %
          </span>
        </div>
        <div className="text-sm text-[#768396] ml-2 mt-2">(24H)</div>
      </div>
      <hr className="my-4" />
      <div className="lg:h-[420px] h-[300px]">
        <TradingViewWidget />
      </div>
    </div>
  );
}

export default Crypto;

// symbol={cryptoData.symbol}
