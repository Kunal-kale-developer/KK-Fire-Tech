package com.kkfiretech.formb360.repository;

import com.kkfiretech.formb360.entity.ComplianceDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplianceDocumentRepository extends JpaRepository<ComplianceDocument, Long> {
    List<ComplianceDocument> findByComplianceItemId(Long complianceItemId);
}
