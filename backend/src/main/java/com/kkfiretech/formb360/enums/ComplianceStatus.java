package com.kkfiretech.formb360.enums;

/**
 * Derived status for a ComplianceItem, computed from its validUntil date
 * rather than stored directly, so it's always accurate.
 *
 * VALID   -> more than 30 days from expiry
 * DUE_SOON -> within 30 days of expiry
 * EXPIRED -> past validUntil
 */
public enum ComplianceStatus {
    VALID,
    DUE_SOON,
    EXPIRED
}
