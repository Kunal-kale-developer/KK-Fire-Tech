package com.kkfiretech.formb360.compliance.dto;

import com.kkfiretech.formb360.compliance.entity.Agency;

import java.time.LocalDate;

public record AgencyResponse(Long id, String licenceNo, LocalDate validFrom,
                             LocalDate validTo, String signatoryName) {
    public static AgencyResponse of(Agency a) {
        return new AgencyResponse(a.getId(), a.getLicenceNo(), a.getValidFrom(),
                a.getValidTo(), a.getSignatoryName());
    }
}