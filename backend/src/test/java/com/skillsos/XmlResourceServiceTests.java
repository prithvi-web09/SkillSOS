package com.skillsos;

import com.skillsos.dto.CampusResourceDto;
import com.skillsos.service.XmlResourceService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class XmlResourceServiceTests {

    @Autowired
    private XmlResourceService xmlResourceService;

    @MockBean
    private com.skillsos.config.FirebaseConfig firebaseConfig;

    @MockBean
    private com.skillsos.repository.FirestoreRepository firestoreRepository;

    @Test
    @DisplayName("Parses campus-resources.xml using DOM parser accurately")
    void testParseCampusResources() {
        List<CampusResourceDto> resources = xmlResourceService.parseCampusResources();
        assertNotNull(resources);
        assertFalse(resources.isEmpty(), "Should parse campus facilities from XML");
        assertTrue(resources.stream().anyMatch(r -> r.getName().contains("Computing & Java Lab")));
        assertTrue(resources.stream().anyMatch(r -> r.getName().contains("Digital Library")));
    }
}
