package com.kkfiretech.formb360.compliance.messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OwnerMessenger {

    private final LogMessageSender logSender;
    private final Msg91SmsSender smsSender;
    private final WhatsAppSender whatsAppSender;

    @Value("${messaging.enabled:false}")
    private boolean enabled;

    /** @return true agar kam se kam ek raste se bhej diya gaya */
    public boolean send(String phone, String text) {
        if (!enabled) {
            return logSender.send(phone, text);
        }
        boolean sent = false;
        if (smsSender.isReady()) sent = smsSender.send(phone, text) || sent;
        if (whatsAppSender.isReady()) sent = whatsAppSender.send(phone, text) || sent;
        return sent;
    }
}