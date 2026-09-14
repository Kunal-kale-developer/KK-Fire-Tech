package com.kkfiretech.formb360.controller;

import com.kkfiretech.formb360.entity.Stakeholder;
import com.kkfiretech.formb360.enums.StakeholderRole;
import com.kkfiretech.formb360.repository.StakeholderRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stakeholders")
@RequiredArgsConstructor
public class StakeholderController {

    private final StakeholderRepository stakeholderRepository;

    @GetMapping
    public List<Stakeholder> list(@RequestParam(required = false) StakeholderRole role) {
        return role == null ? stakeholderRepository.findAll() : stakeholderRepository.findByRole(role);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Stakeholder> get(@PathVariable Long id) {
        return stakeholderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Stakeholder create(@Valid @RequestBody Stakeholder stakeholder) {
        stakeholder.setId(null);
        return stakeholderRepository.save(stakeholder);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        stakeholderRepository.deleteById(id);
    }
}
