package com.kkfiretech.formb360.compliance.dto;

import com.kkfiretech.formb360.compliance.entity.ComplianceBuilding;
import com.kkfiretech.formb360.compliance.enums.Jurisdiction;
import com.kkfiretech.formb360.compliance.enums.Segment;

import java.time.LocalDate;
import java.util.List;

public record BuildingResponse(
        Long id, Long agencyId, String name, String address,
        Segment segment, Jurisdiction jurisdiction,
        String ownerName, String ownerPhone, LocalDate onboardedOn,
        List<UnitResponse> units, CycleInfo currentCycle) {

    public static BuildingResponse of(ComplianceBuilding b, List<UnitResponse> units, CycleInfo cycle) {
        return new BuildingResponse(b.getId(), b.getAgencyId(), b.getName(), b.getAddress(),
                b.getSegment(), b.getJurisdiction(), b.getOwnerName(), b.getOwnerPhone(),
                b.getOnboardedOn(), units, cycle);
    }
}