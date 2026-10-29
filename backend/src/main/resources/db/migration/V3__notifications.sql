CREATE TABLE notifications (
                               id          BIGSERIAL PRIMARY KEY,
                               org_id      BIGINT       NOT NULL,
                               building_id BIGINT       NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
                               cycle_id    BIGINT       NOT NULL REFERENCES compliance_cycles(id) ON DELETE CASCADE,
                               stage       VARCHAR(20)  NOT NULL,
                               message     VARCHAR(500) NOT NULL,
                               due_date    DATE         NOT NULL,
                               is_seen     BOOLEAN      NOT NULL DEFAULT FALSE,
                               created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
                               CONSTRAINT uq_notification_cycle_stage UNIQUE (cycle_id, stage)
);

CREATE INDEX idx_notifications_org_seen
    ON notifications (org_id, is_seen, created_at DESC);