package com.kkfiretech.formb360.compliance.controller;

import com.kkfiretech.formb360.compliance.dto.*;
import com.kkfiretech.formb360.compliance.service.BuildingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buildings")
@RequiredArgsConstructor
public class ComplianceBuildingController {

    private final BuildingService buildingService;

    @PostMapping
    public ResponseEntity<BuildingResponse> create(@Valid @RequestBody BuildingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(buildingService.create(request));
    }

    @GetMapping
    public List<BuildingResponse> list() {
        return buildingService.list();
    }

    @PostMapping("/{id}/units")
    public ResponseEntity<UnitResponse> addUnit(@PathVariable Long id,
                                                @Valid @RequestBody UnitRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(buildingService.addUnit(id, request));
    }
}