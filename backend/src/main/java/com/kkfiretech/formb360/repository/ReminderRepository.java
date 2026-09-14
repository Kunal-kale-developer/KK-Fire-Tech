package com.kkfiretech.formb360.repository;

import com.kkfiretech.formb360.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByScheduledForLessThanEqualAndSentFalse(LocalDate date);
}
