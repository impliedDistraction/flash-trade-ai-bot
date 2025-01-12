import axios from 'axios';
import { getAllPriceFeeds, getSolanaPrice } from '../src/services/pythOracle';

// Jest test cases
describe('Price Feed API Tests', () => {
    it('should fetch all price feeds', async () => {
        const data = await getAllPriceFeeds();
        expect(data).toBeDefined();
        if (data?.parsed) {
            const cryptoFeeds = data.parsed.filter(
                (feed: any) => feed.attributes?.asset_type === 'Crypto'
            );

            expect(Array.isArray(cryptoFeeds)).toBe(true);
            expect(cryptoFeeds.length).toBeGreaterThan(0);

            cryptoFeeds.forEach((feed: any) => {
                expect(feed.attributes?.asset_type).toBe('Crypto');
                expect(feed.attributes).toHaveProperty('base');
                expect(feed.attributes).toHaveProperty('quote_currency');
                expect(feed.attributes).toHaveProperty('symbol');
            });
        }
    });

    it('should handle errors when fetching price feeds', async () => {
        jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('Network Error'));

        await expect(getAllPriceFeeds()).rejects.toThrow('Network Error');
    });

    it('should fetch the current oracle price of Solana', async () => {
        const data = await getSolanaPrice();
        expect(data).toBeDefined();
        if (data) {
            expect(data).toHaveProperty('price');
            expect(data).toHaveProperty('confidence');
            expect(data).toHaveProperty('expo');
            expect(data).toHaveProperty('publishTime');

            const range = data.getPriceRange();
            expect(range).toHaveProperty('lower');
            expect(range).toHaveProperty('upper');

            const formattedTime = data.getFormattedPublishTime();
            expect(typeof formattedTime).toBe('string');
        }
    });
});
