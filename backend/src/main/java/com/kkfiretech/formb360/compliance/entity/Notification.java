package com.kkfiretech.formb360.compliance.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "org_id", nullable = false)
    private Long orgId;

    @Column(name = "building_id", nullable = false)
    private Long buildingId;

    @Column(name = "cycle_id", nullable = false)
    private Long cycleId;

    @Column(nullable = false)
    private String stage;

    @Column(nullable = false)
    private String message;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "is_seen", nullable = false)
    private boolean seen;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}