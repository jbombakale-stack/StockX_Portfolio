import { useState, useEffect } from 'react';
import { MOCK_STOCKS } from '../components/data/mockStocks';


export const useLiveStocks = () => {
    const [liveStocks, setLiveStocks] = useState(() => {
        
        return MOCK_STOCKS.map(stock => ({
            ...stock,
            basePrice: stock.currentPrice / (1 + stock.changePercent / 100), 
        }));
    });

    useEffect(() => {
        
        const fluctuateStocks = () => {
            console.log('🔄 Fluctuating stock prices...'); 
            setLiveStocks(prevStocks =>
                prevStocks.map(stock => {
                    
                    const fluctuation = (Math.random() - 0.5) * 0.6; 
                    const newChangePercent = parseFloat((stock.changePercent + fluctuation).toFixed(2));

                    
                    const newPrice = parseFloat((stock.basePrice * (1 + newChangePercent / 100)).toFixed(2));

                    console.log(`📊 ${stock.symbol}: ${stock.currentPrice} → ${newPrice} (${newChangePercent}%)`); 

                    return {
                        ...stock,
                        currentPrice: newPrice,
                        changePercent: newChangePercent,
                    };
                })
            );
        };

        
        const initialTimeout = setTimeout(() => {
            console.log('⏰ Initial fluctuation triggered');
            fluctuateStocks();
        }, 1000);

        
        
        const interval = setInterval(() => {
            console.log('⏰ Interval fluctuation triggered');
            fluctuateStocks();
        }, 30000); 

        
        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    return liveStocks;
};
