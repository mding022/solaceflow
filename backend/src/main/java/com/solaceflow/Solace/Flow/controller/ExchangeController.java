package com.solaceflow.Solace.Flow.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://demo.millerding.com", "https://solaceflow.pages.dev"})
public class ExchangeController {
    private String[] tickers = { "AAPL", "GOOG", "ABCD", "QQQ", "NYSE", "NASDAQ", "SOLACE", "META", "BRK.A", "NVDA" };

    DataController dc = new DataController();
    private List<String> orderbook = new ArrayList<String>();

    public double matchOrder(String order) {
        String[] chunks = order.split(";");
        if (Integer.valueOf(chunks[2]) > 0) {
            orderbook.add("BUY " + chunks[1] + " - @" + chunks[0] + " bought " + chunks[2] + " shares at $" +  chunks[3] + " per share.");
        } else {
            orderbook.add("SELL " + chunks[1] + " - @" + chunks[0] + " sold " + chunks[2] + " shares at $" +  chunks[3] + " per share.");
        }
        return Double.valueOf(chunks[3]) - 0.5;
    }

    public List<String> getOrderbook() {
        return orderbook;
    }

}