package com.kkfiretech.formb360.compliance.dto;

import java.util.List;

public record DashboardResponse(Counts counts, List<DashboardItem> buildings) {
    public record Counts(long total, long overdue, long dueSoon, long upcoming) {
    }
}