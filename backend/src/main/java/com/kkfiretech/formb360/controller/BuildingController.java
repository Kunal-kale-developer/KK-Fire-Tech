package com.kkfiretech.formb360.controller;

import com.kkfiretech.formb360.dto.BuildingRequest;
import com.kkfiretech.formb360.entity.Building;
import com.kkfiretech.formb360.repository.BuildingRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buildings")
@RequiredArgsConstructor
public class BuildingController {

    private final BuildingRepository buildingRepository;

    @GetMapping
    public List<Building> list() {
        return buildingRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Building> get(@PathVariable Long id) {
        return buildingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Building create(@Valid @RequestBody BuildingRequest request) {
        Building building = Building.builder()
                .name(request.getName())
                .address(request.getAddress())
                .city(request.getCity())
                .buildingType(request.getBuildingType())
                .societyChairmanName(request.getSocietyChairmanName())
                .societyChairmanContact(request.getSocietyChairmanContact())
                .build();
        return buildingRepository.save(building);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Building> update(@PathVariable Long id, @Valid @RequestBody BuildingRequest request) {
        return buildingRepository.findById(id)
                .map(building -> {
                    building.setName(request.getName());
                    building.setAddress(request.getAddress());
                    building.setCity(request.getCity());
                    building.setBuildingType(request.getBuildingType());
                    building.setSocietyChairmanName(request.getSocietyChairmanName());
                    building.setSocietyChairmanContact(request.getSocietyChairmanContact());
                    return ResponseEntity.ok(buildingRepository.save(building));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        buildingRepository.deleteById(id);
    }
}
