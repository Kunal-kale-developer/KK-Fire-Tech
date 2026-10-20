package com.kkfiretech.formb360.compliance.service;

import com.kkfiretech.formb360.auth.security.CurrentUser;
import com.kkfiretech.formb360.compliance.dto.AgencyRequest;
import com.kkfiretech.formb360.compliance.dto.AgencyResponse;
import com.kkfiretech.formb360.compliance.entity.Agency;
import com.kkfiretech.formb360.compliance.repository.AgencyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgencyService {

    private final AgencyRepository agencyRepository;
    private final CurrentUser currentUser;

    @Transactional
    public AgencyResponse create(AgencyRequest r) {
        Long orgId = currentUser.orgId();
        String licenceNo = r.licenceNo().trim();

        if (r.validTo().isBefore(r.validFrom())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "validTo must be after validFrom");
        }
        if (agencyRepository.existsByOrgIdAndLicenceNo(orgId, licenceNo)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Licence number already exists");
        }

        Agency saved = agencyRepository.save(Agency.builder()
                .orgId(orgId)
                .licenceNo(licenceNo)
                .validFrom(r.validFrom())
                .validTo(r.validTo())
                .signatoryName(r.signatoryName().trim())
                .build());
        return AgencyResponse.of(saved);
    }

    @Transactional(readOnly = true)
    public List<AgencyResponse> list() {
        return agencyRepository.findByOrgIdOrderByIdDesc(currentUser.orgId())
                .stream().map(AgencyResponse::of).toList();
    }
}