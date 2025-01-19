import { useState, useEffect } from 'react';

const OrderBook = () => {
    const [orderBook, setOrderBook] = useState([]);

    const fetchOrderBook = () => {
        fetch('http://localhost:8080/orderbook')
            .then((response) => response.text())
            .then((data) => {
                const cleanedData = data.slice(1, -1);
                const orders = cleanedData.split(',').map(order => order.trim());
                setOrderBook(orders);
            })
            .catch((error) => console.error('Error fetching order book:', error));
    };

    useEffect(() => {
        fetchOrderBook();
        const intervalId = setInterval(fetchOrderBook, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <div>
                {orderBook.slice(0).reverse().map((order, index) => (
                    <p key={index} className="text-white">{order}</p>
                ))}
            </div>
        </div>
    );
};

export default OrderBook;
