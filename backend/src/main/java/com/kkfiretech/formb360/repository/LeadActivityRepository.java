package com.kkfiretech.formb360.repository;

import com.kkfiretech.formb360.entity.LeadActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeadActivityRepository extends JpaRepository<LeadActivity, Long> {
    List<LeadActivity> findByLeadIdOrderByDoneAtDesc(Long leadId);
}