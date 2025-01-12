function calculateRSI(data: number[], period: number): number[] {
    if (data.length < period) {
        throw new Error("Not enough data to calculate RSI");
    }

    const rsi: number[] = [];
    let gains = 0;
    let losses = 0;

    // Calculate the initial average gain and loss
    for (let i = 1; i <= period; i++) {
        const change = data[i] - data[i - 1];
        if (change > 0) {
            gains += change;
        } else {
            losses -= change; // Losses are positive values
        }
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    rsi.push(100 - 100 / (1 + avgGain / avgLoss));

    // Calculate subsequent RSIs
    for (let i = period + 1; i < data.length; i++) {
        const change = data[i] - data[i - 1];
        const gain = change > 0 ? change : 0;
        const loss = change < 0 ? -change : 0;

        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;

        const rs = avgGain / avgLoss;
        rsi.push(100 - 100 / (1 + rs));
    }

    return rsi;
}


function calculateBollingerBands(data: number[], period: number, stdDev: number) {
    const sma = data.slice(-period).reduce((a, b) => a + b, 0) / period;
    const variance = data.slice(-period).reduce((a, b) => a + Math.pow(b - sma, 2), 0) / period;
    const stdDeviation = Math.sqrt(variance);

    return {
        upper: sma + stdDev * stdDeviation,
        middle: sma,
        lower: sma - stdDev * stdDeviation,
    };
}

function bollingerReversionStrategy(data: number[]) {
    const { upper, middle, lower } = calculateBollingerBands(data, 20, 2);
    const rsi = calculateRSI(data, 5); // Compute RSI values

    const lastPrice = data[data.length - 1];
    const lastRSI = rsi[rsi.length - 1]; // Get the most recent RSI value

    if (lastRSI === undefined || lastRSI === null) {
        return "HOLD"; // Skip trade decision if RSI is unavailable
    }

    if (lastPrice > upper && lastRSI > 70) {
        return "SELL";
    }
    if (lastPrice < lower && lastRSI < 30) {
        return "BUY";
    }
    return "HOLD";
}


function volumeSpikeStrategy(data: { close: number[]; volume: number[] }) {
    const avgVolume = data.volume.slice(-10).reduce((a, b) => a + b, 0) / 10;
    const lastVolume = data.volume[data.volume.length - 1];
    const priceChange = (data.close[data.close.length - 1] - data.close[data.close.length - 2]) / data.close[data.close.length - 2];

    if (lastVolume > 2 * avgVolume) {
        if (priceChange > 0.02) return "SELL";
        if (priceChange < -0.02) return "BUY";
    }
    return "HOLD";
}

function calculateVWAP(data: { close: number[]; volume: number[] }) {
    const cumulativePriceVolume = data.close.map((price, index) => price * data.volume[index]);
    const cumulativeVolume = data.volume.reduce((a, b) => a + b, 0);
    const cumulativePriceVolumeSum = cumulativePriceVolume.reduce((a, b) => a + b, 0);

    return cumulativePriceVolumeSum / cumulativeVolume;
}

function vwapStrategy(data: { close: number[]; volume: number[] }) {
    const vwap = calculateVWAP(data);
    const lastPrice = data.close[data.close.length - 1];
    const deviation = (lastPrice - vwap) / vwap;

    if (deviation > 0.03) return "SELL";
    if (deviation < -0.03) return "BUY";
    return "HOLD";
}

async function newsSentimentStrategy(newsSentiment: string, data: { close: number[] }) {
    const lastPrice = data.close[data.close.length - 1];
    const prevPrice = data.close[data.close.length - 2];
    const priceChange = (lastPrice - prevPrice) / prevPrice;

    if (newsSentiment === "positive" && priceChange > 0.02) return "SELL";
    if (newsSentiment === "negative" && priceChange < -0.02) return "BUY";
    return "HOLD";
}


export {
    calculateRSI,
    calculateBollingerBands,
    bollingerReversionStrategy,
    volumeSpikeStrategy,
    calculateVWAP,
    vwapStrategy,
    newsSentimentStrategy
};