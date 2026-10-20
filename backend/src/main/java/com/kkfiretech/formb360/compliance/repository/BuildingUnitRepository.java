package com.kkfiretech.formb360.compliance.repository;

import com.kkfiretech.formb360.compliance.entity.BuildingUnit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface BuildingUnitRepository extends JpaRepository<BuildingUnit, Long> {
    List<BuildingUnit> findByBuildingIdIn(Collection<Long> buildingIds);
    boolean existsByBuildingIdAndName(Long buildingId, String name);
}