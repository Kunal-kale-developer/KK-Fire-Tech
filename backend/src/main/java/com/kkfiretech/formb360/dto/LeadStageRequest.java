package com.kkfiretech.formb360.dto;

import com.kkfiretech.formb360.enums.LeadStage;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LeadStageRequest {

    @NotNull
    private LeadStage stage;
}