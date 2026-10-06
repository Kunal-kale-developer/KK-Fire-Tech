package com.kkfiretech.formb360.controller;

import com.kkfiretech.formb360.dto.LeadActivityRequest;
import com.kkfiretech.formb360.dto.LeadRequest;
import com.kkfiretech.formb360.dto.LeadStageRequest;
import com.kkfiretech.formb360.entity.Lead;
import com.kkfiretech.formb360.entity.LeadActivity;
import com.kkfiretech.formb360.enums.LeadStage;
import com.kkfiretech.formb360.repository.LeadActivityRepository;
import com.kkfiretech.formb360.repository.LeadRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadRepository leadRepository;
    private final LeadActivityRepository leadActivityRepository;

    @GetMapping
    public List<Lead> list(@RequestParam(required = false) LeadStage stage) {
        return stage == null ? leadRepository.findAll() : leadRepository.findByStage(stage);
    }

    /** Today's Queue: follow-ups due today or overdue, excluding closed leads. */
    @GetMapping("/queue")
    public List<Lead> queue() {
        return leadRepository.findByNextFollowUpDateLessThanEqualAndStageNotInOrderByNextFollowUpDateAsc(
                LocalDate.now(), List.of(LeadStage.SIGNED, LeadStage.LOST));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Lead create(@Valid @RequestBody LeadRequest request) {
        return leadRepository.save(toLead(request));
    }

    /** Bulk import: send a JSON array of leads (e.g. 100 societies at once). */
    @PostMapping("/bulk")
    @ResponseStatus(HttpStatus.CREATED)
    public List<Lead> bulkCreate(@RequestBody List<@Valid LeadRequest> requests) {
        return leadRepository.saveAll(requests.stream().map(this::toLead).toList());
    }

    @PutMapping("/{id}/stage")
    public Lead changeStage(@PathVariable Long id, @Valid @RequestBody LeadStageRequest request) {
        Lead lead = findLead(id);
        lead.setStage(request.getStage());
        return leadRepository.save(lead);
    }

    @PostMapping("/{id}/activities")
    @ResponseStatus(HttpStatus.CREATED)
    public LeadActivity logActivity(@PathVariable Long id, @Valid @RequestBody LeadActivityRequest request) {
        Lead lead = findLead(id);

        if (lead.getStage() == LeadStage.NEW) {
            lead.setStage(LeadStage.CONTACTED);
        }
        if (request.getNextFollowUpDate() != null) {
            lead.setNextFollowUpDate(request.getNextFollowUpDate());
        }
        leadRepository.save(lead);

        LeadActivity activity = LeadActivity.builder()
                .lead(lead)
                .type(request.getType())
                .outcome(request.getOutcome())
                .build();
        return leadActivityRepository.save(activity);
    }

    @GetMapping("/{id}/activities")
    public List<LeadActivity> activities(@PathVariable Long id) {
        return leadActivityRepository.findByLeadIdOrderByDoneAtDesc(id);
    }

    private Lead findLead(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lead not found"));
    }

    private Lead toLead(LeadRequest request) {
        return Lead.builder()
                .organizationName(request.getOrganizationName())
                .segment(request.getSegment())
                .source(request.getSource())
                .city(request.getCity())
                .area(request.getArea())
                .contactName(request.getContactName())
                .contactRole(request.getContactRole())
                .phone(request.getPhone())
                .email(request.getEmail())
                .ownerName(request.getOwnerName())
                .nextFollowUpDate(request.getNextFollowUpDate())
                .build();
    }
}