package com.example.service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.model.Property;
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
        CollectionReference propertiesCollection = firestore.collection("properties"); // "properties" είναι το όνομα της συλλογής σας στο Firestore

        ApiFuture<QuerySnapshot> future = propertiesCollection.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        for (QueryDocumentSnapshot document : documents) {
            // Converts each document to a Property object.
            // Ensure your Property class has a no-arg constructor and getters/setters for all fields.
            Property property = document.toObject(Property.class);
            properties.add(property);
        }
        return properties;
    }
}