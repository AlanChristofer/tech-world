package com.alanchristofer.portfolio.infrastructure.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DevelopmentDataSeederTest {
    private static final String URL = "https://github.com/AlanChristofer/AlanChristofer";

    @Test
    void shouldKeepPlainUrlUnchanged() {
        assertThat(DevelopmentDataSeeder.normalizeMarkdownUrl(URL)).isEqualTo(URL);
    }

    @Test
    void shouldExtractUrlFromEquivalentMarkdownLink() {
        assertThat(DevelopmentDataSeeder.normalizeMarkdownUrl("[" + URL + "](" + URL + ")")).isEqualTo(URL);
    }

    @Test
    void shouldKeepInvalidOrAmbiguousContentUnchanged() {
        String invalid = "[https://example.com](https://different.example.com)";

        assertThat(DevelopmentDataSeeder.normalizeMarkdownUrl(invalid)).isEqualTo(invalid);
    }
}
