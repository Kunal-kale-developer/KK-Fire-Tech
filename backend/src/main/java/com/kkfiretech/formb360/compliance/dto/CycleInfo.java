package com.kkfiretech.formb360.compliance.dto;

import com.kkfiretech.formb360.compliance.entity.ComplianceCycle;
import com.kkfiretech.formb360.compliance.enums.CycleStatus;

import java.time.LocalDate;

public record CycleInfo(Integer year, Short half, LocalDate periodStart,
                        LocalDate periodEnd, LocalDate dueDate, CycleStatus status) {
    public static CycleInfo of(ComplianceCycle c, LocalDate today) {
        return new CycleInfo(c.getYear(), c.getHalf(), c.getPeriodStart(),
                c.getPeriodEnd(), c.getDueDate(), CycleStatus.of(c.getDueDate(), today));
    }
}