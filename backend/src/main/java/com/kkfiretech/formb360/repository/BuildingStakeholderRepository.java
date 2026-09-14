package com.kkfiretech.formb360.repository;

import com.kkfiretech.formb360.entity.BuildingStakeholder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BuildingStakeholderRepository extends JpaRepository<BuildingStakeholder, Long> {
    List<BuildingStakeholder> findByBuildingId(Long buildingId);
    List<BuildingStakeholder> findByStakeholderId(Long stakeholderId);
}
