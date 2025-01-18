import { useState, useEffect } from 'react';
import ChartComponent from './stockupdates/sample';
import stockNames from './stockupdates/name.json';
import { motion } from 'framer-motion';

export default function Home() {
    const [ticker, setTicker] = useState('');
    const [stockData, setStockData] = useState('');
    const [shares, setShares] = useState(0);
    const [username, setUsername] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [portfolioBalance, setPortfolioBalance] = useState(10000);
    const [cashBalance, setCashBalance] = useState(0);
    const [holdings, setHoldings] = useState([]);
    const [popupMessage, setPopupMessage] = useState('');

    const handleUsernameSubmit = () => {
        fetch(`http://localhost:8080/authenticate?username=${username}`)
            .then((response) => response.text())
            .then((data) => {
                if (data === "200" || data === "100") {
                    setIsAuthenticated(true);
                } else {
                    setPopupMessage('Authentication failed');
                }
            })
            .catch((error) => {
                console.error('Error authenticating user:', error);
                setPopupMessage('Error authenticating user');
            });
    };

    const handlePlaceOrder = (isBuy) => {
        if (!ticker || !shares || shares <= 0 || stockData === "Invalid ticker") {
            setPopupMessage('Please enter a valid ticker and quantity');
            return;
        }

        const quantity = isBuy ? shares : -shares;

        fetch(`http://localhost:8080/place?username=${username}&ticker=${ticker}&quantity=${quantity}`)
            .then((response) => response.text())
            .then((data) => {
                if (data === "Success") {
                    setPopupMessage(`Successfully ${isBuy ? 'bought' : 'sold'} ${shares} shares of ${ticker}`);
                    setShares(0);
                } else {
                    setPopupMessage('Order failed to process');
                }
            })
            .catch((error) => {
                console.error('Error placing order:', error);
                setPopupMessage('Error placing order');
            });
    };

    useEffect(() => {
        if (!ticker) return;

        const fetchStockData = () => {
            fetch(`http://localhost:8080/stock?ticker=${ticker}`)
                .then((response) => response.text())
                .then((data) => {
                    const parsedData = parseFloat(data);
                    if (!isNaN(parsedData)) {
                        const formattedPrice = parsedData.toFixed(2);
                        const stockName = stockNames[ticker];
                        setStockData({ ticker, name: stockName, price: formattedPrice });
                    } else {
                        setStockData('Invalid ticker');
                    }
                })
                .catch((error) => console.error('Error fetching stock data:', error));
        };

        fetchStockData();
        const interval = setInterval(fetchStockData, 1000);

        return () => clearInterval(interval);
    }, [ticker]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchHoldings = () => {
            fetch(`http://localhost:8080/get-holdings?username=${username}`)
                .then((response) => response.text())
                .then((data) => {
                    if (data && data !== "-999") {
                        try {
                            const holdingsData = data.replace(/{|}/g, '').split(', ');
                            const parsedHoldings = holdingsData.map(item => {
                                const [ticker, shares] = item.split('=');
                                return { ticker, shares: parseInt(shares) };
                            });
                            setHoldings(parsedHoldings);
                        } catch (error) {
                            console.error('Error parsing holdings:', error);
                            setHoldings([]);
                        }
                    }
                })
                .catch((error) => console.error('Error fetching holdings:', error));
        };

        const fetchPortfolioBalance = () => {
            fetch(`http://localhost:8080/get-portfolio?username=${username}`)
                .then((response) => response.text())
                .then((data) => {
                    const balance = parseFloat(data);
                    if (!isNaN(balance)) {
                        setPortfolioBalance(balance);
                    }
                })
                .catch((error) => console.error('Error fetching portfolio balance:', error));
        };

        const fetchCashBalance = () => {
            fetch(`http://localhost:8080/get-cash?username=${username}`)
                .then((response) => response.text())
                .then((data) => {
                    const cash = parseFloat(data);
                    if (!isNaN(cash) && cash !== -999) {
                        setCashBalance(cash);
                    }
                })
                .catch((error) => console.error('Error fetching cash balance:', error));
        };

        fetchHoldings();
        fetchPortfolioBalance();
        fetchCashBalance();

        const holdingsInterval = setInterval(fetchHoldings, 1000);
        const portfolioInterval = setInterval(fetchPortfolioBalance, 1000);
        const cashInterval = setInterval(fetchCashBalance, 1000);

        return () => {
            clearInterval(holdingsInterval);
            clearInterval(portfolioInterval);
            clearInterval(cashInterval);
        };
    }, [isAuthenticated, username]);

    useEffect(() => {
        if (popupMessage) {
            setTimeout(() => setPopupMessage(''), 2000);
        }
    }, [popupMessage]);

    if (!isAuthenticated) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-black text-white">
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl sm:text-2xl md:text-3xl font-semibold mb-10">Login using your SolaceFlow Demo Account</h1>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your @username"
                        className="bg-white/10 text-white px-6 py-4 rounded-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/60 text-lg w-64 h-[4rem]"
                    />
                    <button
                        onClick={handleUsernameSubmit}
                        className="mt-8 bg-lime-700 text-white px-6 py-4 rounded-md"
                    >
                        Log In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="flex flex-col min-h-screen bg-black text-white p-4">
            <div className="flex flex-col w-full animate-fade-in-down">
                <div className="flex items-center mt-6 ml-10">
                    <a className="cursor-pointer" href="/">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black">
                            SolaceFlow.
                        </h1>
                    </a>
                    <div className="flex items-center gap-4 ml-6">
                        <input
                            type="text"
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value.toUpperCase())}
                            placeholder='Try searching "AAPL"'
                            className="bg-white/10 backdrop-blur-md text-white px-6 py-4 rounded-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/60 text-lg w-64 h-[4rem]"
                            autoFocus
                        />
                    </div>
                    <h2 className="mb-0 ml-6 text-gray-50 py-2 text-3xl font-extrabold h-16 resize-none text-left mt-4">
                        {typeof stockData === 'string' ? (
                            stockData
                        ) : (
                            <motion.div
                                animate={{ y: 0 }}
                                initial={{ y: 10 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                            >
                                <span className="text-2xl font-extrabold text-slate-300">{stockData.name}</span>
                                <span className="text-4xl font-black ml-3">${stockData.price}<span className="text-gray-200 text-2xl ml-1">&nbsp;USD</span></span>
                            </motion.div>
                        )}
                    </h2>
                </div>

                <div className="absolute right-4 top-7 flex flex-col items-end">
                    <p className="text-md rounded-md font-semibold text-slate-400 flex items-center">
                        Logged in: @{username}
                    </p>
                    <p className="text-4xl rounded-md font-extrabold text-white flex items-center">
                        ${portfolioBalance.toFixed(2)}
                    </p>
                    <p className="text-xl px-0.5 rounded-md font-black text-green-300 flex items-center">
                        Cash: ${cashBalance.toFixed(2)}
                    </p>
                    <a href="#" className="mt-2 z-50">
                        <button className="cursor-pointer rounded-[8px] bg-neutral-200 px-3 py-1 text-sm text-neutral-950 transition-colors hover:bg-neutral-100 active:bg-neutral-50">Transfer Funds</button>
                    </a>
                </div>

                {popupMessage && (
                    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white py-2 px-4 rounded-md z-50">
                        {popupMessage}
                    </div>
                )}

                <div className="flex-1 mt-16 ml-10 w-[70%] relative">
                    <ChartComponent ticker={ticker} />
                </div>
                <div className="absolute pr-0 mr-4 top-[43%] pt-64 right-0 transform -translate-y-1/2 w-[25%] flex flex-col gap-4">
                    <input
                        type="number"
                        value={shares}
                        onChange={(e) => setShares(parseInt(e.target.value) || 0)}
                        className="bg-white/10 backdrop-blur-md text-white px-6 py-4 rounded-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/60 text-lg h-[4rem]"
                        placeholder="Enter quantity"
                    />
                    <button
                        className="bg-lime-700 text-white rounded-md px-6 py-4 w-full"
                        onClick={() => handlePlaceOrder(true)}
                    >
                        Buy {shares} shares @ {stockData && stockData.price}
                    </button>
                    <button
                        className="bg-pink-900 text-white rounded-md px-6 py-4 w-full"
                        onClick={() => handlePlaceOrder(false)}
                    >
                        Sell {shares} shares @ {stockData && stockData.price}
                    </button>

                    <div className="w-[100%] h-[400px] overflow-y-auto border border-white/20 rounded-md p-4 bg-white/10 backdrop-blur-md">
                        <h3 className="text-2xl font-semibold mb-4">Stocks You Own</h3>
                        {holdings.map((stock, index) => (
                            <div key={index} className="flex justify-between py-2 border-b border-white/20">
                                <span>{stock.ticker}</span>
                                <span>{stock.shares} shares</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-2 ml-10 w-[70%] h-64 overflow-y-auto border-white/20 rounded-md p-4 bg-white/10 backdrop-blur-md">
                    <p className="mb-4">Order Book</p>
                </div>

            </div>
        </main>
    );
}
