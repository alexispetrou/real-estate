package com.example.service;

import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.model.Property;
import com.example.model.SearchParameters;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;

@Service
public class PropertyService {

    private final Firestore firestore;

    @Autowired
    public PropertyService(Firestore firestore) {
        this.firestore = firestore;
    }

    public List<Property> getAllProperties() throws ExecutionException, InterruptedException {
        List<Property> properties = new ArrayList<>();
        CollectionReference propertiesCollection = firestore.collection("properties");

        ApiFuture<QuerySnapshot> future = propertiesCollection.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        for (QueryDocumentSnapshot document : documents) {
            Property property = document.toObject(Property.class);
            property.setId(document.getId());
            properties.add(property);
        }
        return properties;
    }

    public List<String> getAllCategories() throws ExecutionException, InterruptedException {
        Set<String> categories = new HashSet<>();
        List<Property> properties = getAllProperties();
        for (Property property : properties) {
            if (property.getCategory() != null) {
                categories.add(property.getCategory());
            }
        }
        return new ArrayList<>(categories);
    }

    public List<String> getAllAreas() throws ExecutionException, InterruptedException {
        Set<String> areas = new HashSet<>();
        List<Property> properties = getAllProperties();
        for (Property property : properties) {
            if (property.getArea() != null) {
                areas.add(property.getArea());
            }
        }
        return new ArrayList<>(areas);
    }

    public List<Property> searchProperties(SearchParameters params) throws ExecutionException, InterruptedException {
        List<Property> all = getAllProperties();

        System.out.println("Total properties from DB: " + all.size());
        System.out.println("Search parameters:");
        System.out.println("Category: " + params.getCategory());
        System.out.println("Area: " + params.getArea());
        System.out.println("Type: " + params.getType());
        System.out.println("Min Price: " + params.getMinPrice());
        System.out.println("Max Price: " + params.getMaxPrice());
        System.out.println("Min Size: " + params.getMinSize());
        System.out.println("Max Size: " + params.getMaxSize());

        List<Property> filtered = all.stream()
                .filter(p -> {
                    boolean match = params.getCategory() == null
                            || params.getCategory().equalsIgnoreCase(p.getCategory());
                    if (!match)
                        System.out.println("Filtered out by category: " + p);
                    return match;
                })
                .filter(p -> {
                    boolean match = params.getArea() == null || params.getArea().equalsIgnoreCase(p.getArea());
                    return match;
                })
                .filter(p -> {
                    if (params.getType() == null)
                        return true;

                    if ("sale".equalsIgnoreCase(params.getType())) {
                        if (params.getMinPrice() != null
                                && (p.getPriceSale() == null || p.getPriceSale() < params.getMinPrice())) {
                            return false;
                        }
                        if (params.getMaxPrice() != null
                                && (p.getPriceSale() == null || p.getPriceSale() > params.getMaxPrice())) {
                            return false;
                        }
                    } else if ("rent".equalsIgnoreCase(params.getType())) {
                        if (params.getMinPrice() != null
                                && (p.getPriceRent() == null || p.getPriceRent() < params.getMinPrice())) {
                            return false;
                        }
                        if (params.getMaxPrice() != null
                                && (p.getPriceRent() == null || p.getPriceRent() > params.getMaxPrice())) {
                            return false;
                        }
                    }
                    return true;
                })
                .filter(p -> {
                    boolean match = params.getMinSize() == null
                            || (p.getSize() != null && p.getSize() >= params.getMinSize());

                    return match;
                })
                .filter(p -> {
                    boolean match = params.getMaxSize() == null
                            || (p.getSize() != null && p.getSize() <= params.getMaxSize());

                    return match;
                })
                .collect(Collectors.toList());

        return filtered;
    }

}
