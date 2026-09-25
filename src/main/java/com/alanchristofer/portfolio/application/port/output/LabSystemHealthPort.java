package com.alanchristofer.portfolio.application.port.output;

import java.util.Map;

public interface LabSystemHealthPort {
    Map<String, String> componentStatuses();
}
