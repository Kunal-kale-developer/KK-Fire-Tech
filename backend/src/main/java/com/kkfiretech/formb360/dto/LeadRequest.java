package com.kkfiretech.formb360.dto;

import com.kkfiretech.formb360.enums.LeadSource;
import com.kkfiretech.formb360.enums.Segment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LeadRequest {

    @NotBlank
    private String organizationName;

    @NotNull
    private Segment segment;

    @NotNull
    private LeadSource source;

    private String city;
    private String area;
    private String contactName;
    private String contactRole;
    private String phone;
    private String email;
    private String ownerName;
    private LocalDate nextFollowUpDate;
}