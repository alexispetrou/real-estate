package com.example.controller;

import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.model.Property;
import com.example.service.PropertyService;

@RestController
@RequestMapping("/api") // Base path for your API
@CrossOrigin(origins = "http://localhost:3000") // Επιτρέψτε το React app σας να κάνει requests (αλλάξτε το port αν χρειάζεται)
public class PropertyController {

    private final PropertyService propertyService;

    @Autowired
    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping("/properties") // Endpoint: /api/properties
    public ResponseEntity<List<Property>> getAllProperties() {
        try {
            List<Property> properties = propertyService.getAllProperties();
            return new ResponseEntity<>(properties, HttpStatus.OK);
        } catch (InterruptedException | ExecutionException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}