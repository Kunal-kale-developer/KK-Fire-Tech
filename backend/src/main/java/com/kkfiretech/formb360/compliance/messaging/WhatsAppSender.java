package com.kkfiretech.formb360.compliance.messaging;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class WhatsAppSender {

    @Value("${messaging.whatsapp.enabled:false}")
    private boolean enabled;
    @Value("${messaging.whatsapp.access-token:}")
    private String accessToken;
    @Value("${messaging.whatsapp.phone-number-id:}")
    private String phoneNumberId;
    @Value("${messaging.whatsapp.template-name:}")
    private String templateName;

    public boolean isReady() {
        return enabled && !accessToken.isBlank() && !phoneNumberId.isBlank() && !templateName.isBlank();
    }

    public boolean send(String phone, String text) {
        // TODO: provider milne par yahan HTTP call likhni hai
        log.warn("WhatsApp provider abhi connect nahi hai. Phone: {}", phone);
        return false;
    }
}