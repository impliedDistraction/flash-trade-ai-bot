import axios from 'axios';

const API_BASE_URL = 'https://api.flash.trade'; // Replace with actual Flash.Trade API URL

/**
 * Fetch market data from Flash.Trade API.
 * @returns {Promise<any>} The market data response.
 */
export const fetchMarketData = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/market-data`);
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw new Error('Failed to fetch market data');
  }
};

/**
 * Place an order on the Flash.Trade platform.
 * @param {string} market - The market identifier (e.g., "BTC/USDT").
 * @param {string} side - Order side ("buy" or "sell").
 * @param {number} amount - Order amount.
 * @param {number} price - Order price.
 * @returns {Promise<any>} The order response.
 */
export const placeOrder = async (
  market: string,
  side: 'buy' | 'sell',
  amount: number,
  price: number
): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders`, {
      market,
      side,
      amount,
      price,
    });
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw new Error('Failed to place order');
  }
};
