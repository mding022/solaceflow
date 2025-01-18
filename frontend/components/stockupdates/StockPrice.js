import React, { useState, useEffect } from 'react';

const StockPrice = () => {
    const [price, setPrice] = useState(null);

    useEffect(() => {
        const fetchPrice = () => {
            fetch('http://localhost:8080/overview')
                .then(response => response.text())
                .then(data => {
                    console.log('Received data:', data);
                    setPrice(data); // Set the price from the response
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        };

        // Fetch the data every second
        const intervalId = setInterval(fetchPrice, 500);

        // Cleanup interval on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div>
            {price ? <p>{price}</p> : <p>Waiting for updates...</p>}
        </div>
    );
};

export default StockPrice;
