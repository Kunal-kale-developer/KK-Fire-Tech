package com.kkfiretech.formb360.entity;

import com.kkfiretech.formb360.enums.StakeholderRole;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stakeholders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stakeholder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StakeholderRole role;

    private String email;

    private String phone;

    private String organization; // e.g. architecture firm, vendor company name
}
