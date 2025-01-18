package com.solaceflow.Solace.Flow;

import jakarta.annotation.PostConstruct;

import java.text.SimpleDateFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.solaceflow.Solace.Flow.controller.DataController;
import com.solaceflow.Solace.Flow.controller.ExchangeController;

import java.util.Date;
import jakarta.jms.JMSException;
import jakarta.jms.Message;
import jakarta.jms.TextMessage;

@SpringBootApplication
@EnableScheduling
public class SolaceFlowApplication {
	public static void main(String[] args) {
		SpringApplication.run(SolaceFlowApplication.class, args);
	}

	@JmsListener(destination = "stock/price/updates")
	public void handle(Message message) {
		if (message instanceof TextMessage) {
			TextMessage tm = (TextMessage) message;
			try {
				String receivedMessage = tm.getText();
				//System.out.println(receivedMessage);
				double[] response = new double[10];
				int count = 0;
				for (String reg : receivedMessage.split("X")) {
					response[count] = Double.parseDouble(reg);
					count++;
				}
				dc.setValue(response);
				dc.pushToHistory(response);
			} catch (JMSException e) {
				e.printStackTrace();
			}
		} else {
			System.out.println("Received non-text message: " + message.toString());
		}
	}

	@JmsListener(destination = "stock/exchange/orders")
	public void handleExchange(Message message) {
		if (message instanceof TextMessage) {
			TextMessage tm = (TextMessage) message;
			try {
				String receivedMessage = tm.getText();
				System.out.println(receivedMessage);
				ec.matchOrder(receivedMessage);
			} catch (JMSException e) {
				e.printStackTrace();
			}
		} else {
			System.out.println("Received non-text message on queue stock/exchange/orders: " + message.toString());
		}
	}

	@Autowired
	DataController dc;

	@Autowired
	ExchangeController ec;
}
