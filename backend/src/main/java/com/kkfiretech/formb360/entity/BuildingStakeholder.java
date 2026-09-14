package com.kkfiretech.formb360.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

/**
 * Links a Stakeholder to a Building. A stakeholder (e.g. one vendor)
 * can be assigned to many buildings, and a building has many stakeholders
 * (its architect, its AMC vendor, its chairman, etc).
 */
@Entity
@Table(name = "building_stakeholders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuildingStakeholder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "building_id", nullable = false)
    @JsonIgnoreProperties({"complianceItems", "stakeholders"})
    private Building building;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "stakeholder_id", nullable = false)
    private Stakeholder stakeholder;
}
