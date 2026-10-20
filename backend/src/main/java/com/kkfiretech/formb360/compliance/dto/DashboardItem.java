package com.kkfiretech.formb360.compliance.dto;

import com.kkfiretech.formb360.compliance.enums.CycleStatus;
import com.kkfiretech.formb360.compliance.enums.Jurisdiction;
import com.kkfiretech.formb360.compliance.enums.Segment;

import java.time.LocalDate;

public record DashboardItem(
        Long buildingId, String buildingName, String address,
        Segment segment, Jurisdiction jurisdiction,
        Integer year, Short half,
        LocalDate periodStart, LocalDate periodEnd, LocalDate dueDate,
        long daysToDue, CycleStatus status) {
}