import asyncio
import logging
from typing import Callable, Any, TypeVar, Awaitable

T = TypeVar("T")

logger = logging.getLogger(__name__)

async def retry_with_backoff(
    func: Callable[..., Awaitable[T]],
    *args,
    max_retries: int = 1,
    base_delay: float = 1.0,
    **kwargs
) -> T:
    """
    Implements a strict retry policy:
    TRY 1
    If failed: WAIT exponential backoff
    TRY 2
    If failed again: STOP EXECUTION / Raise DataCollectionFailure
    """
    last_exception = None
    
    for attempt in range(max_retries + 1):
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            last_exception = e
            logger.warning(f"Attempt {attempt + 1} failed for {func.__name__}: {e}")
            
            if attempt < max_retries:
                delay = base_delay * (2 ** attempt)
                logger.info(f"Retrying in {delay} seconds...")
                await asyncio.sleep(delay)
            else:
                logger.error(f"Final attempt failed for {func.__name__}. Terminating process for this source.")
    
    # If we reached here, it means all retries failed
    raise last_exception or Exception("Unknown data collection failure")
