package com.alanchristofer.portfolio.application.port.input;

import com.alanchristofer.portfolio.domain.model.LabSystemHealth;

public interface GetLabSystemHealthUseCase {
    LabSystemHealth getHealth();
}
