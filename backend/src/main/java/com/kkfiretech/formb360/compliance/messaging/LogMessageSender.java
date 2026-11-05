package com.kkfiretech.formb360.compliance.messaging;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class LogMessageSender implements MessageSender {

    @Override
    public boolean send(String phone, String text) {
        log.info("[DEMO] Owner ko message jata ({}): {}", phone, text);
        return true;
    }
}