package com.kkfiretech.formb360.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BuildingRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String address;

    private String city;

    private String buildingType;

    private String societyChairmanName;

    private String societyChairmanContact;
}
