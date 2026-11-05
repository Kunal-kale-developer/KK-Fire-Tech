package com.kkfiretech.formb360.compliance.messaging;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class Msg91SmsSender {

    @Value("${messaging.sms.enabled:false}")
    private boolean enabled;
    @Value("${messaging.sms.api-key:}")
    private String apiKey;
    @Value("${messaging.sms.sender-id:}")
    private String senderId;
    @Value("${messaging.sms.template-id:}")
    private String templateId;

    public boolean isReady() {
        return enabled && !apiKey.isBlank() && !senderId.isBlank() && !templateId.isBlank();
    }

    public boolean send(String phone, String text) {
        // TODO: provider milne par yahan HTTP call likhni hai
        log.warn("SMS provider abhi connect nahi hai. Phone: {}", phone);
        return false;
    }
}