package com.kkfiretech.formb360.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kkfiretech.formb360.enums.ActivityType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "lead_activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lead_id", nullable = false)
    @JsonIgnoreProperties({"convertedBuilding"})
    private Lead lead;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityType type;

    private String outcome;

    @Column(nullable = false, updatable = false)
    private Instant doneAt;

    @PrePersist
    void onCreate() {
        this.doneAt = Instant.now();
    }
}