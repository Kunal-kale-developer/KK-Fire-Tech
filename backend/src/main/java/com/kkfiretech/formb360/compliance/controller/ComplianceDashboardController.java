package com.kkfiretech.formb360.compliance.controller;

import com.kkfiretech.formb360.compliance.dto.DashboardResponse;
import com.kkfiretech.formb360.compliance.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class ComplianceDashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponse get() {
        return dashboardService.get();
    }
}