
# SolaceFlow - uOttaHack7 2025

SolaceFlow is an implementation of the data streams between stock market exchanges, market data, and brokerages, using Solace's Event Brokers and Queues. For this project, we used randomly generated fluctuating market data and a set number of sample tickers to simulate the real-world market. 
## Solace Implementation

- Implements Solace's Event Broker Queues to communicate data between the stock exchange, simulated market data, and backend client.
- ```Queue: stocks/price/update/*``` simulated market data is published into the queue, and all connected backend clients are automatically subscribed to the data stream.
- ```Queue: stocks/exchange/orders``` orders placed by the backend client are published into this queue and are processed by the stock exchange, by matching a buyer and a seller. For the purposes of this project, it is assumed there is enough liquidity for all clients to buy/sell freely.
- ```Queue: stocks/exchange/orderbook``` orders placed by all clients in the exchange are publically published by the exchange application in this queue.

## Deployment

To deploy this project with Docker containers, use:

```bash
  docker-compose up --build
```

Or, you can run the Spring project and React project separately:

```bash
  cd ./frontend
  npm run dev

  cd ./backend
  mvn spring-boot:run
```
## Demo

After successfully deploying this project, you should be able to visit ```localhost:3000```. You can use multiple instances of the localhost, as it runs independently of each other through user-login sessions. User-data will be saved in the backend client side of the application. ![Video Link](https://www.youtube.com/watch?v=-MLvedE2G5M)

## Screenshots

Frontend Landing Page:


Trading Page:


