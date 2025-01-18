package com.solaceflow.Solace.Flow.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.solaceflow.Solace.Flow.service.SolacePublisherService;

import jakarta.annotation.PostConstruct;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class DataController {

    @Autowired
    private SolacePublisherService solacePublisherService;

    @Autowired
    private ExchangeController ec;

    private HashMap<String, Double> cash = new HashMap<String, Double>(); //cash
    private HashMap<String, HashMap<String, Integer>> holdings = new HashMap<String, HashMap<String, Integer>>() ;
    private double[] price;
    private String[] tickers = { "AAPL", "GOOG", "ABCD", "QQQ", "NYSE", "NASDAQ", "SOLACE", "META", "BRK.A", "NVDA" };
    private HashMap<String,Double[]> history = new HashMap<>();

    @PostConstruct
    public void init() {
        Double[] empty = {0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0};
        for (String ticker : tickers) {
            history.put(ticker, empty.clone());
        }
    }

    @GetMapping("/overview")
    public String getData() {
        String res = "";
        for (int i = 0; i < 10; ++i) {
            res = res + tickers[i] + "  " + price[i] + "  |  ";
        }
        return res;
    }

    @GetMapping("/authenticate")
    public String auth (@RequestParam String username) {
        if(cash.containsKey(username)) {
            return "100"; //returning user
        } else {
            cash.put(username, 10000.00);
            holdings.put(username, new HashMap<String, Integer>());
            return "200"; //new user
        }
    }

    @GetMapping("/get-cash")
    public double getPortfolio (@RequestParam String username) {
        if(!cash.containsKey(username)) {
            return -999;
        } else {
            return cash.get(username);
        }
    }

    @GetMapping("/get-holdings")
    public String getHoldings (@RequestParam String username) {
        if(!holdings.containsKey(username)) {
            return "-999";
        } else {
            return holdings.get(username).toString();
        }
    }

    @GetMapping("/modify-user")
    public String modifyUserPortfolio (@RequestParam String username, @RequestParam double value) {
        if(cash.containsKey(username)) {
            double temp = cash.get(username) + value;
            cash.remove(username);
            cash.put(username, temp);
            return "Success";
        }
        return "Unsuccessful";
    }

    @GetMapping("/stock")
    public String getStockPrice(@RequestParam String ticker) {
        for(int i = 0; i < 10; ++i) {
            if(tickers[i].equals(ticker)) {
                String formattedNumber = String.valueOf(String.format("%.2f", price[i]));
                return formattedNumber;
            }
        }
        return "$" + ticker + " not found.";
    }

    public void pushToHistory(double[] price) {
        List<Double> list = new ArrayList<>();
        for(int i = 0; i<10; ++i) {
            list = new ArrayList<Double>(10);
            for(double p : history.get(tickers[i])) {
                list.add(p);
            }
            list.remove(0);
            list.add(price[i]);
            for(int j = 0; j < 10; ++j) {
                history.get(tickers[i])[j] = list.get(j);
            }
        }
    }

    @GetMapping("/recent")
    public List<String> getRecent(@RequestParam String ticker) {
        List<String> res = new ArrayList<String>();
        for(int i = 0; i < 10; ++i) {
            res.add(String.valueOf(history.get(ticker)[i]));
        }
        return res;
    }

    public void setValue(double[] price) {
        this.price = price;
    }

    @GetMapping("/get-portfolio")
    public String getPortfolioValue(@RequestParam String username) {
        if(cash.containsKey(username)) {
            double c = cash.get(username);
            double h = 0;
            for(String key : holdings.get(username).keySet()) {
                h+=holdings.get(username).get(key)*getPrice(key);
            }
            return String.valueOf(c+h);
        }
        return "Error";
    }

    public double getPrice(String ticker) {
        for(int i = 0; i < 10; ++i) {
            if(tickers[i].equals(ticker)) {
                String formattedNumber = String.valueOf(String.format("%.2f", price[i]));
                return Double.valueOf(formattedNumber);
            }
        }
        return -999;
    }

    @GetMapping("/place")
    public String placeOrder(@RequestParam String username, @RequestParam String ticker, @RequestParam int quantity) throws Exception{
        double c = cash.get(username);
        double orderCost = getPrice(ticker)*quantity;
        cash.remove(username);
        cash.put(username, (c-orderCost));
        if(holdings.get(username).containsKey(ticker)) {
            int iq = holdings.get(username).get(ticker);
            iq+=quantity;
            holdings.get(username).remove(ticker);
            holdings.get(username).put(ticker, iq);
        } else {
            holdings.get(username).put(ticker, quantity);
        }
        System.out.println("User @" + username + " placed a transaction of " + quantity + " shares for " + ticker);
        solacePublisherService.sendEvent(username+";"+ticker+";"+String.valueOf(quantity)+";"+String.valueOf(getPrice(ticker)), "stock/exchange/orders");
        return "Success";
    }

    @GetMapping("/orderbook")
    public String getOrderbook() {
        return ec.getOrderbook().toString();
    }
}