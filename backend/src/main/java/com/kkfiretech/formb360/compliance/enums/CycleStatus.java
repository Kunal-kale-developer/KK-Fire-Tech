package com.kkfiretech.formb360.compliance.enums;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public enum CycleStatus {
    OVERDUE, DUE_SOON, UPCOMING;

    public static CycleStatus of(LocalDate dueDate, LocalDate today) {
        if (today.isAfter(dueDate)) return OVERDUE;
        if (ChronoUnit.DAYS.between(today, dueDate) <= 15) return DUE_SOON;
        return UPCOMING;
    }
}