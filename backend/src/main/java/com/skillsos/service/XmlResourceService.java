package com.skillsos.service;

import com.skillsos.dto.CampusResourceDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Service demonstrating XML Document Object Model (DOM) parsing
 * as prescribed in the Full Stack Java Lab syllabus.
 */
@Service
public class XmlResourceService {

    private static final Logger log = LoggerFactory.getLogger(XmlResourceService.class);

    private final ResourceLoader resourceLoader;

    @Value("${skillsos.resources.xml-path:classpath:campus-resources.xml}")
    private String xmlPath;

    public XmlResourceService(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    /**
     * Parses the campus-resources.xml file using DOM APIs (DocumentBuilderFactory, Document, Element).
     */
    public List<CampusResourceDto> parseCampusResources() {
        List<CampusResourceDto> resources = new ArrayList<>();
        try {
            Resource resource = resourceLoader.getResource(xmlPath);
            if (!resource.exists()) {
                log.warn("Campus resources XML not found at {}", xmlPath);
                return Collections.emptyList();
            }

            try (InputStream inputStream = resource.getInputStream()) {
                DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                // Disable external entities to prevent XXE vulnerabilities
                factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
                factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
                factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);

                DocumentBuilder builder = factory.newDocumentBuilder();
                Document doc = builder.parse(inputStream);
                doc.getDocumentElement().normalize();

                NodeList nodeList = doc.getElementsByTagName("resource");
                for (int i = 0; i < nodeList.getLength(); i++) {
                    Node node = nodeList.item(i);
                    if (node.getNodeType() == Node.ELEMENT_NODE) {
                        Element elem = (Element) node;

                        String id = getTagValue("id", elem);
                        String name = getTagValue("name", elem);
                        String category = getTagValue("category", elem);
                        String building = getTagValue("building", elem);
                        String floor = getTagValue("floor", elem);
                        String contact = getTagValue("contact", elem);
                        String timings = getTagValue("timings", elem);
                        String description = getTagValue("description", elem);

                        resources.add(new CampusResourceDto(id, name, category, building, floor, contact, timings, description));
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to parse campus resources XML: {}", e.getMessage(), e);
        }
        return resources;
    }

    private String getTagValue(String tag, Element element) {
        NodeList nodeList = element.getElementsByTagName(tag);
        if (nodeList != null && nodeList.getLength() > 0) {
            Node node = nodeList.item(0);
            if (node != null && node.getFirstChild() != null) {
                return node.getFirstChild().getNodeValue();
            }
        }
        return "";
    }
}
