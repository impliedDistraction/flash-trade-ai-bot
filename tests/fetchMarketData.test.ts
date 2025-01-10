import axios from 'axios';
import { fetchMarketData, placeOrder } from '../src/services/flashTradeAPI';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

test('fetchMarketData should return data on successful API call', async () => {
  const mockData = { market: 'BTC/USDT', price: 30000 };
  mockedAxios.get.mockResolvedValueOnce({ data: mockData });

  const result = await fetchMarketData();
  expect(result).toEqual(mockData);
  expect(mockedAxios.get).toHaveBeenCalledWith('https://api.flash.trade/market-data');
});
