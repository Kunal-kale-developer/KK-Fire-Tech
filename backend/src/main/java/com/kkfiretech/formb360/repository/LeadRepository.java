package com.kkfiretech.formb360.repository;

import com.kkfiretech.formb360.entity.Lead;
import com.kkfiretech.formb360.enums.LeadStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByStage(LeadStage stage);
    List<Lead> findByNextFollowUpDateLessThanEqualAndStageNotInOrderByNextFollowUpDateAsc(
            LocalDate date, Collection<LeadStage> stages);
}