package com.kkfiretech.formb360.entity;

import com.kkfiretech.formb360.enums.ReminderChannel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "reminders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "compliance_item_id", nullable = false)
    private ComplianceItem complianceItem;

    @Column(nullable = false)
    private LocalDate scheduledFor; // e.g. 30/15/7 days before validUntil

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReminderChannel channel;

    @Builder.Default
    private boolean sent = false;
}
