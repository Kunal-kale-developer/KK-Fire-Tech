package com.kkfiretech.formb360.compliance.controller;

import com.kkfiretech.formb360.compliance.service.CycleSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cycles")
@RequiredArgsConstructor
public class CycleController {

    private final CycleSubmissionService submissionService;

    @PostMapping("/{id}/submit")
    public Map<String, Boolean> submit(@PathVariable Long id) {
        submissionService.submit(id);
        return Map.of("ok", true);
    }

    @PostMapping("/{id}/undo")
    public Map<String, Boolean> undo(@PathVariable Long id) {
        submissionService.undo(id);
        return Map.of("ok", true);
    }
}