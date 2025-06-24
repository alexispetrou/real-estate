package com.example.controller;

import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.model.Property;
import com.example.model.SearchParameters;
import com.example.service.PropertyService;

@RestController
@RequestMapping("/api") 
@CrossOrigin(origins = "http://localhost:3000") 
                                               
public class PropertyController {

    private final PropertyService propertyService;

    @Autowired
    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping("/properties") 
    public ResponseEntity<List<Property>> getAllProperties() {
        try {
            List<Property> properties = propertyService.getAllProperties();
            return new ResponseEntity<>(properties, HttpStatus.OK);
        } catch (InterruptedException | ExecutionException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/properties/categories")
    public ResponseEntity<List<String>> getCategories() {
        try {

            return new ResponseEntity<>(propertyService.getAllCategories(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/properties/areas")
    public ResponseEntity<List<String>> getAreas() {
        try {
            return new ResponseEntity<>(propertyService.getAllAreas(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/properties/search")
    public ResponseEntity<List<Property>> searchProperties(@ModelAttribute SearchParameters params) {
        System.out.println("Search parameters: " + params);
        try {
            List<Property> results = propertyService.searchProperties(params);
            return new ResponseEntity<>(results, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}