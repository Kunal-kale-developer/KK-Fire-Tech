package com.kkfiretech.formb360.dto;

import com.kkfiretech.formb360.enums.ComplianceType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ComplianceItemRequest {

    @NotNull
    private Long buildingId;

    @NotNull
    private ComplianceType type;

    private String issuingAuthority;

    @NotNull
    private LocalDate validFrom;

    @NotNull
    private LocalDate validUntil;

    private Integer renewalCycleMonths;
}
