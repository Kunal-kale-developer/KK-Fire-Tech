package com.kkfiretech.formb360.compliance.repository;

import com.kkfiretech.formb360.compliance.enums.Jurisdiction;
import com.kkfiretech.formb360.compliance.enums.Segment;

import java.time.LocalDate;

public record DashboardRow(
        Long buildingId, String buildingName, String address,
        Segment segment, Jurisdiction jurisdiction,
        Integer year, Short half,
        LocalDate periodStart, LocalDate periodEnd, LocalDate dueDate) {
}