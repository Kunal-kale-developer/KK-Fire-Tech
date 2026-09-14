package com.kkfiretech.formb360.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kkfiretech.formb360.enums.ComplianceStatus;
import com.kkfiretech.formb360.enums.ComplianceType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "compliance_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplianceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "building_id", nullable = false)
    @JsonIgnoreProperties({"complianceItems", "stakeholders"})
    private Building building;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplianceType type;

    private String issuingAuthority; // e.g. Chief Fire Officer, Pune Municipal Corporation

    @Column(nullable = false)
    private LocalDate validFrom;

    @Column(nullable = false)
    private LocalDate validUntil;

    /** How many months between renewals, e.g. 12 for an annual Form B. */
    private Integer renewalCycleMonths;

    @OneToMany(mappedBy = "complianceItem", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ComplianceDocument> documents = new ArrayList<>();

    /**
     * Derived, not persisted: VALID / DUE_SOON (<=30 days) / EXPIRED,
     * computed against today's date whenever this entity is read.
     */
    @Transient
    public ComplianceStatus getStatus() {
        LocalDate today = LocalDate.now();
        if (validUntil.isBefore(today)) {
            return ComplianceStatus.EXPIRED;
        }
        if (!validUntil.isAfter(today.plusDays(30))) {
            return ComplianceStatus.DUE_SOON;
        }
        return ComplianceStatus.VALID;
    }
}
