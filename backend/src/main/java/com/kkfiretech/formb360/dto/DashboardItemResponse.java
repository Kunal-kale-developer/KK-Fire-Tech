package com.kkfiretech.formb360.dto;

import com.kkfiretech.formb360.entity.ComplianceItem;
import com.kkfiretech.formb360.enums.ComplianceStatus;
import com.kkfiretech.formb360.enums.ComplianceType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DashboardItemResponse {

    private Long complianceItemId;
    private Long buildingId;
    private String buildingName;
    private ComplianceType type;
    private LocalDate validUntil;
    private ComplianceStatus status;

    public static DashboardItemResponse from(ComplianceItem item) {
        return new DashboardItemResponse(
                item.getId(),
                item.getBuilding().getId(),
                item.getBuilding().getName(),
                item.getType(),
                item.getValidUntil(),
                item.getStatus()
        );
    }
}
