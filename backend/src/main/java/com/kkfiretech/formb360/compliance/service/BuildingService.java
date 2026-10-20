package com.kkfiretech.formb360.compliance.service;

import com.kkfiretech.formb360.auth.security.CurrentUser;
import com.kkfiretech.formb360.compliance.dto.*;
import com.kkfiretech.formb360.compliance.entity.BuildingUnit;
import com.kkfiretech.formb360.compliance.entity.ComplianceBuilding;
import com.kkfiretech.formb360.compliance.repository.AgencyRepository;
import com.kkfiretech.formb360.compliance.repository.BuildingUnitRepository;
import com.kkfiretech.formb360.compliance.repository.ComplianceBuildingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BuildingService {

    private final ComplianceBuildingRepository buildingRepository;
    private final BuildingUnitRepository unitRepository;
    private final AgencyRepository agencyRepository;
    private final CycleService cycleService;
    private final CurrentUser currentUser;

    @Transactional
    public BuildingResponse create(BuildingRequest r) {
        Long orgId = currentUser.orgId();

        if (r.agencyId() != null && agencyRepository.findByIdAndOrgId(r.agencyId(), orgId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Agency not found");
        }

        ComplianceBuilding saved = buildingRepository.save(ComplianceBuilding.builder()
                .orgId(orgId)
                .agencyId(r.agencyId())
                .name(r.name().trim())
                .address(r.address().trim())
                .segment(r.segment())
                .jurisdiction(r.jurisdiction())
                .ownerName(r.ownerName())
                .ownerPhone(r.ownerPhone())
                .onboardedOn(r.onboardedOn() != null ? r.onboardedOn() : LocalDate.now(CycleService.IST))
                .build());

        var cycle = cycleService.ensureCurrentCycle(saved);
        return BuildingResponse.of(saved, List.of(),
                CycleInfo.of(cycle, LocalDate.now(CycleService.IST)));
    }

    @Transactional(readOnly = true)
    public List<BuildingResponse> list() {
        List<ComplianceBuilding> buildings = buildingRepository.findByOrgIdOrderByIdDesc(currentUser.orgId());
        if (buildings.isEmpty()) return List.of();

        Map<Long, List<UnitResponse>> unitsByBuilding = unitRepository
                .findByBuildingIdIn(buildings.stream().map(ComplianceBuilding::getId).toList())
                .stream()
                .collect(Collectors.groupingBy(BuildingUnit::getBuildingId,
                        Collectors.mapping(UnitResponse::of, Collectors.toList())));

        return buildings.stream()
                .map(b -> BuildingResponse.of(b, unitsByBuilding.getOrDefault(b.getId(), List.of()), null))
                .toList();
    }

    @Transactional
    public UnitResponse addUnit(Long buildingId, UnitRequest r) {
        buildingRepository.findByIdAndOrgId(buildingId, currentUser.orgId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Building not found"));

        String name = r.name().trim();
        if (unitRepository.existsByBuildingIdAndName(buildingId, name)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Unit already exists in this building");
        }

        BuildingUnit saved = unitRepository.save(BuildingUnit.builder()
                .buildingId(buildingId)
                .name(name)
                .heightM(r.heightM())
                .build());
        return UnitResponse.of(saved);
    }
}