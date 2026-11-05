package com.kkfiretech.formb360.compliance.dto;

import com.kkfiretech.formb360.compliance.enums.Jurisdiction;
import com.kkfiretech.formb360.compliance.enums.Segment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BuildingUpdateRequest(
        @NotBlank String name,
        @NotBlank String address,
        @NotNull Segment segment,
        @NotNull Jurisdiction jurisdiction,
        Long agencyId,
        String ownerName,
        String ownerPhone) {
}