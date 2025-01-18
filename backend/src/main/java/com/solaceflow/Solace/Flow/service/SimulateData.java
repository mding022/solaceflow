package com.solaceflow.Solace.Flow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.Random;

@Service
public class SimulateData {

    private final Random random = new Random();
    private final DecimalFormat decimalFormat = new DecimalFormat("0.00");
    double[] price = {100,200,150,900,400,500,233,840,1002,753};
    
    @Autowired
    private SolacePublisherService solacePublisherService;

    @Scheduled(fixedRate = 500)
    public void generateRandomData() throws Exception {
        String[] parsed = new String[10];
        for(int i = 0; i < 10; ++i) {
            double randomValue = Math.abs(random.nextDouble()/2);
            price[i]+=randomValue;
            String formattedValue = decimalFormat.format(price[i]);
            parsed[i] = formattedValue;
        }
        String response = "";
        for(int i = 0; i < 9; ++i) {
            response += parsed[i];
            response += "X";
        }
        response +=parsed[9];
        solacePublisherService.sendEvent(response, "stock/price/updates");
    }
}
