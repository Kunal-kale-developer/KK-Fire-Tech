package com.kkfiretech.formb360.compliance.repository;

import com.kkfiretech.formb360.compliance.entity.ComplianceCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ComplianceCycleRepository extends JpaRepository<ComplianceCycle, Long> {

    Optional<ComplianceCycle> findByBuildingIdAndYearAndHalf(Long buildingId, Integer year, Short half);

    @Query("""
        select new com.kkfiretech.formb360.compliance.repository.DashboardRow(
            b.id, b.name, b.address, b.segment, b.jurisdiction,
            c.year, c.half, c.periodStart, c.periodEnd, c.dueDate)
        from ComplianceCycle c, ComplianceBuilding b
        where c.buildingId = b.id
          and c.orgId = :orgId and b.orgId = :orgId
          and c.periodStart <= :today and c.periodEnd >= :today
        order by c.dueDate asc, b.name asc
        """)
    List<DashboardRow> findCurrentCycleRows(@Param("orgId") Long orgId, @Param("today") LocalDate today);
}