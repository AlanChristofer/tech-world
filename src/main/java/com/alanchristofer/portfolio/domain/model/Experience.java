package com.alanchristofer.portfolio.domain.model;

import java.util.List;

/** Representa uma experiência configurável; nenhum histórico profissional é presumido. */
public record Experience(
    String id, String company, String role, String roleEn, String description, String descriptionEn,
    int startYear, Integer endYear, List<String> technologies,
    List<String> highlights, List<String> highlightsEn, int order
) {
}
