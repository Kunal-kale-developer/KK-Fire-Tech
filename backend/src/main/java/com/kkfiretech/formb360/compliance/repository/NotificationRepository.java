package com.kkfiretech.formb360.compliance.repository;

import com.kkfiretech.formb360.compliance.entity.Notification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    boolean existsByCycleIdAndStage(Long cycleId, String stage);

    List<Notification> findByOrgIdOrderByCreatedAtDesc(Long orgId, Pageable pageable);

    long countByOrgIdAndSeenFalse(Long orgId);

    Optional<Notification> findByIdAndOrgId(Long id, Long orgId);
}