package com.kkfiretech.formb360.compliance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record UnitRequest(@NotBlank String name, @Positive BigDecimal heightM) {
}