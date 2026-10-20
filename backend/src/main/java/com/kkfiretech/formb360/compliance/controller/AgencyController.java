package com.kkfiretech.formb360.compliance.controller;

import com.kkfiretech.formb360.compliance.dto.AgencyRequest;
import com.kkfiretech.formb360.compliance.dto.AgencyResponse;
import com.kkfiretech.formb360.compliance.service.AgencyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agencies")
@RequiredArgsConstructor
public class AgencyController {

    private final AgencyService agencyService;

    @PostMapping
    public ResponseEntity<AgencyResponse> create(@Valid @RequestBody AgencyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agencyService.create(request));
    }

    @GetMapping
    public List<AgencyResponse> list() {
        return agencyService.list();
    }
}