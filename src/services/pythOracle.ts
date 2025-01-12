import { BN } from '@coral-xyz/anchor';
import axios, { AxiosError } from 'axios';
import { OraclePrice } from 'flash-sdk';
import { fetch } from 'undici';

const PythAPI = 'https://hermes.pyth.network';

class PriceFeed {
    id: string;
    price: number;
    confidence: number;
    expo: number;
    publishTime: number;

    constructor(
        id: string,
        priceData: { price: number; conf: number; expo: number; publish_time: number }
    ) {
        this.id = id;
        this.price = priceData.price ?? 0;
        this.confidence = priceData.conf ?? 0;
        this.expo = priceData.expo ?? 0;
        this.publishTime = priceData.publish_time ?? 0;
    }

    getScaledPrice(): number {
        return this.price * Math.pow(10, this.expo);
    }

    getScaledConfidence(): number {
        return this.confidence * Math.pow(10, this.expo);
    }

    getPriceRange(): { lower: number; upper: number } {
        const scaledPrice = this.getScaledPrice();
        const scaledConfidence = this.getScaledConfidence();
        return {
            lower: scaledPrice - scaledConfidence,
            upper: scaledPrice + scaledConfidence,
        };
    }

    getFormattedPublishTime(): string {
        return new Date(this.publishTime * 1000).toISOString();
    }

    toOraclePrice() :OraclePrice {
        return new OraclePrice({
            price: new BN(this.price),
            confidence: new BN(this.confidence),
            exponent: new BN(this.expo),
            timestamp: new BN(this.publishTime)
        });
    }
}

interface ApiResponse {
    parsed: Array<{
        id: string;
        price?: {
            price: string;
            conf: string;
            expo: number;
            publish_time: number;
        };
        ema_price?: {
            price: string;
            conf: string;
            expo: number;
            publish_time: number;
        };
        metadata?: {
            slot: number;
            proof_available_time: number;
            prev_publish_time: number;
        };
    }>;
    binary: {
        encoding: string;
        data: string[];
    };
}

// Utility function for error logging
function logError(message: string, error: unknown) {
    if (axios.isAxiosError(error)) {
        console.error(`${message}:`, error.response?.data || error.message);
    } else {
        console.error(`${message}:`, error);
    }
}

// Utility function to parse price data
function parsePriceData(priceData: {
    price: string;
    conf: string;
    expo: number;
    publish_time: number;
}): { price: number; conf: number; expo: number; publish_time: number } {
    return {
        price: parseFloat(priceData.price),
        conf: parseFloat(priceData.conf),
        expo: priceData.expo,
        publish_time: priceData.publish_time,
    };
}

// Fetch all price feeds
async function getAllPriceFeeds(): Promise<ApiResponse | undefined> {
    try {
        const response = await axios.get<ApiResponse>(`${PythAPI}/v2/price_feeds`);
        return response.data;
    } catch (error) {
        logError('Error fetching all price feeds', error);
        throw error;
    }
}

// Fetch Solana price feed
async function getSolanaPrice(): Promise<PriceFeed | undefined> {
    const url = `${PythAPI}/v2/updates/price/latest?ids%5B%5D=0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43`;

    try {
        const response = await fetch(url);
        const data: ApiResponse = (await response.json()) as ApiResponse;

        if (!data || !Array.isArray(data.parsed)) {
            console.error('Invalid API response structure:', data);
            return undefined;
        }

        const solanaData = data.parsed.find(
            (item) =>
                item.id === 'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43'
        );

        if (!solanaData?.price) {
            console.error('No matching price data found for Solana:', solanaData);
            return undefined;
        }

        const parsedPriceData = parsePriceData(solanaData.price);
        return new PriceFeed(solanaData.id, parsedPriceData);
    } catch (error) {
        logError('Error fetching Solana price', error);
        return undefined;
    }
}

export { PriceFeed, getAllPriceFeeds, getSolanaPrice };