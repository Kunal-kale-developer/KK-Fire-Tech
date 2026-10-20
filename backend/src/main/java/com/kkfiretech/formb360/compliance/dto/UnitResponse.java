package com.kkfiretech.formb360.compliance.dto;

import com.kkfiretech.formb360.compliance.entity.BuildingUnit;

import java.math.BigDecimal;

public record UnitResponse(Long id, String name, BigDecimal heightM) {
    public static UnitResponse of(BuildingUnit u) {
        return new UnitResponse(u.getId(), u.getName(), u.getHeightM());
    }
}