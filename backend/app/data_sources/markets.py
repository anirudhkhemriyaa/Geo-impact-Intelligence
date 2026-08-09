import yfinance as yf
from typing import Dict, Any, List

def fetch_market_signals(symbols: List[str]) -> Dict[str, Any]:
    """
    Fetches real-world price signals for commodities and industries.
    Used to validate impact scores with real data.
    """
    signals = {}
    for symbol in symbols:
        try:
            ticker = yf.Ticker(symbol)
            # Use 5d history to see immediate reaction
            hist = ticker.history(period="5d")
            if not hist.empty:
                current = hist['Close'].iloc[-1]
                opening = hist['Close'].iloc[0]
                change_pct = ((current - opening) / opening) * 100
                
                signals[symbol] = {
                    "price": round(float(current), 2),
                    "change_5d_pct": round(float(change_pct), 2),
                    "trend": "up" if change_pct > 0 else "down"
                }
        except Exception as e:
            print(f"Market Signal Warning ({symbol}): {e}")
            
    return signals
