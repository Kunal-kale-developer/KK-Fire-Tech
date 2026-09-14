package com.kkfiretech.formb360.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "compliance_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplianceDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "compliance_item_id", nullable = false)
    @JsonIgnoreProperties("documents")
    private ComplianceItem complianceItem;

    @Column(nullable = false)
    private String fileName;

    /** Path/URL in whichever object storage backs this (e.g. S3 key). */
    @Column(nullable = false)
    private String fileUrl;

    @Column(nullable = false, updatable = false)
    private Instant uploadedAt;

    @PrePersist
    void onCreate() {
        this.uploadedAt = Instant.now();
    }
}
