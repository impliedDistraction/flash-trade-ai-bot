import { fetchMarketData } from '../src/services/flashTradeAPI';

test('fetchMarketData should throw an error for invalid URL', async () => {
  // Mock axios to avoid making real API calls
  jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network Error'));

  await expect(fetchMarketData()).rejects.toThrow('Failed to fetch market data');
});
