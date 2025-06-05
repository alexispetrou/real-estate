package com.example.model;

import java.util.List; // Για το ID του εγγράφου

import com.google.cloud.firestore.annotation.DocumentId;

public class Property {
    @DocumentId // Αυτό το annotation χαρτογραφεί το Firestore document ID σε αυτό το πεδίο
    private String id;
    private String title;
    private Long price_sale; // Χρησιμοποιούμε Long ή Double ανάλογα με τον τύπο στο Firestore
    private String area;
    private Long size; // Επειδή το είχατε ως "size m²", μπορεί να είναι String ή Double
    private Integer bedrooms;
    private Integer bathrooms;
    private List<String> images; // Τώρα είναι λίστα URLs εικόνων

    // Default constructor που χρειάζεται για το Firebase deserialization
    public Property() {
    }

    // Constructor με όλα τα πεδία (προαιρετικό αλλά καλή πρακτική)
    public Property(String id, String title, Long price_sale, String area, Long size, Integer bedrooms, Integer bathrooms, List<String> images) {
        this.id = id;
        this.title = title;
        this.price_sale = price_sale;
        this.area = area;
        this.size = size;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.images = images;
    }

    // Getters και Setters (ΑΠΑΡΑΙΤΗΤΑ για το Firebase deserialization και JSON serialization)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Long getPrice_sale() { return price_sale; }
    public void setPrice_sale(Long price_sale) { this.price_sale = price_sale; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public Long getSize() { return size; }
    public void setSize(Long size) { this.size = size; }
    public Integer getBedrooms() { return bedrooms; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }
    public Integer getBathrooms() { return bathrooms; }
    public void setBathrooms(Integer bathrooms) { this.bathrooms = bathrooms; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    @Override
    public String toString() {
        return "Property{" +
               "id='" + id + '\'' +
               ", title='" + title + '\'' +
               ", price_sale=" + price_sale +
               ", area='" + area + '\'' +
               ", size='" + size + '\'' +
               ", bedrooms=" + bedrooms +
               ", bathrooms=" + bathrooms +
               ", images=" + images +
               '}';
    }
}
