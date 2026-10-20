package com.kkfiretech.formb360.compliance.service;

import com.kkfiretech.formb360.auth.security.CurrentUser;
import com.kkfiretech.formb360.compliance.dto.DashboardItem;
import com.kkfiretech.formb360.compliance.dto.DashboardResponse;
import com.kkfiretech.formb360.compliance.enums.CycleStatus;
import com.kkfiretech.formb360.compliance.repository.ComplianceBuildingRepository;
import com.kkfiretech.formb360.compliance.repository.ComplianceCycleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ComplianceBuildingRepository buildingRepository;
    private final ComplianceCycleRepository cycleRepository;
    private final CycleService cycleService;
    private final CurrentUser currentUser;

    @Transactional
    public DashboardResponse get() {
        Long orgId = currentUser.orgId();
        LocalDate today = LocalDate.now(CycleService.IST);

        // Half badal gaya ho (Jul/Jan) toh naye half ka cycle bhi ban jaye. Idempotent hai.
        buildingRepository.findByOrgIdOrderByIdDesc(orgId).forEach(cycleService::ensureCurrentCycle);

        List<DashboardItem> items = cycleRepository.findCurrentCycleRows(orgId, today).stream()
                .map(r -> new DashboardItem(
                        r.buildingId(), r.buildingName(), r.address(),
                        r.segment(), r.jurisdiction(), r.year(), r.half(),
                        r.periodStart(), r.periodEnd(), r.dueDate(),
                        ChronoUnit.DAYS.between(today, r.dueDate()),
                        CycleStatus.of(r.dueDate(), today)))
                .toList();

        long overdue = items.stream().filter(i -> i.status() == CycleStatus.OVERDUE).count();
        long dueSoon = items.stream().filter(i -> i.status() == CycleStatus.DUE_SOON).count();
        long upcoming = items.stream().filter(i -> i.status() == CycleStatus.UPCOMING).count();

        return new DashboardResponse(
                new DashboardResponse.Counts(items.size(), overdue, dueSoon, upcoming), items);
    }
}