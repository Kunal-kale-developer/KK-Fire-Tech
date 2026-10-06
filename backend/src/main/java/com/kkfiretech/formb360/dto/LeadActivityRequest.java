package com.kkfiretech.formb360.dto;

import com.kkfiretech.formb360.enums.ActivityType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LeadActivityRequest {

    @NotNull
    private ActivityType type;

    private String outcome;
    private LocalDate nextFollowUpDate;
}