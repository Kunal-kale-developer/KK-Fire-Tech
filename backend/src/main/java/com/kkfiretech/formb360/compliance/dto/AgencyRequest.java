package com.kkfiretech.formb360.compliance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record AgencyRequest(
        @NotBlank String licenceNo,
        @NotNull LocalDate validFrom,
        @NotNull LocalDate validTo,
        @NotBlank String signatoryName) {
}