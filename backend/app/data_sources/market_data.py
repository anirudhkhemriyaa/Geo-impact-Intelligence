import yfinance as yf
from typing import Dict, Any

def get_market_signals(symbols: list):
    """
    Fetches real-world market signals for relevant symbols (e.g., Oil, Gold, Defense stocks).
    """
    signals = {}
    for symbol in symbols:
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="5d")
            if not hist.empty:
                current_price = hist['Close'].iloc[-1]
                prev_price = hist['Close'].iloc[0]
                change_pct = ((current_price - prev_price) / prev_price) * 100
                signals[symbol] = {
                    "price": round(current_price, 2),
                    "change_pct": round(change_pct, 2)
                }
        except Exception as e:
            print(f"Market Data Error for {symbol}: {e}")
    return signals
