package com.kkfiretech.formb360.compliance.messaging;

public interface MessageSender {
    /** @return true agar message bhej diya gaya (ya log ho gaya) */
    boolean send(String phone, String text);
}