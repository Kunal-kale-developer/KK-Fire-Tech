package com.kkfiretech.formb360.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kkfiretech.formb360.enums.LeadSource;
import com.kkfiretech.formb360.enums.LeadStage;
import com.kkfiretech.formb360.enums.Segment;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "leads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String organizationName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Segment segment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeadSource source;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private LeadStage stage = LeadStage.NEW;

    private String city;
    private String area;

    private String contactName;
    private String contactRole; // Chairman / Secretary / FM / Plant Head
    private String phone;
    private String email;

    private String ownerName;
    private LocalDate nextFollowUpDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "converted_building_id")
    @JsonIgnoreProperties({"complianceItems", "stakeholders"})
    private Building convertedBuilding;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }
}