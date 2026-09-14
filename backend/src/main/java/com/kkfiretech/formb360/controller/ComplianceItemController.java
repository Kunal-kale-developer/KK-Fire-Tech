package com.kkfiretech.formb360.controller;

import com.kkfiretech.formb360.dto.ComplianceItemRequest;
import com.kkfiretech.formb360.dto.DashboardItemResponse;
import com.kkfiretech.formb360.entity.Building;
import com.kkfiretech.formb360.entity.ComplianceItem;
import com.kkfiretech.formb360.repository.BuildingRepository;
import com.kkfiretech.formb360.repository.ComplianceItemRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/compliance-items")
@RequiredArgsConstructor
public class ComplianceItemController {

    private final ComplianceItemRepository complianceItemRepository;
    private final BuildingRepository buildingRepository;

    @GetMapping
    public List<ComplianceItem> list(@RequestParam(required = false) Long buildingId) {
        return buildingId == null
                ? complianceItemRepository.findAll()
                : complianceItemRepository.findByBuildingId(buildingId);
    }

    /**
     * Dashboard feed: everything expiring within `withinDays` (default 30),
     * soonest first. This backs the color-coded expiry list on the frontend.
     */
    @GetMapping("/expiring")
    public List<DashboardItemResponse> expiring(@RequestParam(defaultValue = "30") int withinDays) {
        LocalDate cutoff = LocalDate.now().plusDays(withinDays);
        return complianceItemRepository.findExpiringBy(cutoff).stream()
                .map(DashboardItemResponse::from)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ComplianceItem create(@Valid @RequestBody ComplianceItemRequest request) {
        Building building = buildingRepository.findById(request.getBuildingId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Building not found"));

        ComplianceItem item = ComplianceItem.builder()
                .building(building)
                .type(request.getType())
                .issuingAuthority(request.getIssuingAuthority())
                .validFrom(request.getValidFrom())
                .validUntil(request.getValidUntil())
                .renewalCycleMonths(request.getRenewalCycleMonths())
                .build();

        return complianceItemRepository.save(item);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        complianceItemRepository.deleteById(id);
    }
}
