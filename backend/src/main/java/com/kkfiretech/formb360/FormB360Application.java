package com.kkfiretech.formb360;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FormB360Application {

    public static void main(String[] args) {
        SpringApplication.run(FormB360Application.class, args);
    }
}

