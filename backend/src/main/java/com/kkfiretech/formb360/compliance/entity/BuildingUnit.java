package com.kkfiretech.formb360.compliance.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "building_units")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BuildingUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "building_id", nullable = false)
    private Long buildingId;

    @Column(nullable = false)
    private String name;

    @Column(name = "height_m")
    private BigDecimal heightM;
}