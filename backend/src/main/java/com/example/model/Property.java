package com.example.model;

import java.util.List;
import com.google.cloud.firestore.annotation.PropertyName;

public class Property {
    private String id;
    private String category;
    private String title;
    private Long priceSale;
    private Long priceRent;
    private String area;
    private Long size;
    private Integer bedrooms;
    private Integer bathrooms;
    private List<String> images;
    private Integer distMetro;
    private Boolean elavator;
    private Integer floor;
    private Boolean garden;
    private Boolean parking;
    private Boolean pet;
    private Boolean pool;
    private Boolean storage;
    private Integer year;

    public Property() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @PropertyName("price_sale")
    public Long getPriceSale() {
        return priceSale;
    }

    @PropertyName("price_sale")
    public void setPriceSale(Long priceSale) {
        this.priceSale = priceSale;
    }

    @PropertyName("price_rent")
    public Long getPriceRent() {
        return priceRent;
    }

    @PropertyName("price_rent")
    public void setPriceRent(Long priceRent) {
        this.priceRent = priceRent;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public Integer getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(Integer bedrooms) {
        this.bedrooms = bedrooms;
    }

    public Integer getBathrooms() {
        return bathrooms;
    }

    public void setBathrooms(Integer bathrooms) {
        this.bathrooms = bathrooms;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    @PropertyName("dist_metro")
    public Integer getDistMetro() {
        return distMetro;
    }

    @PropertyName("dist_metro")
    public void setDistMetro(Integer distMetro) {
        this.distMetro = distMetro;
    }

    public Boolean getElavator() {
        return elavator;
    }

    public void setElavator(Boolean elavator) {
        this.elavator = elavator;
    }

    public Integer getFloor() {
        return floor;
    }

    public void setFloor(Integer floor) {
        this.floor = floor;
    }

    public Boolean getGarden() {
        return garden;
    }

    public void setGarden(Boolean garden) {
        this.garden = garden;
    }

    public Boolean getParking() {
        return parking;
    }

    public void setParking(Boolean parking) {
        this.parking = parking;
    }

    public Boolean getPet() {
        return pet;
    }

    public void setPet(Boolean pet) {
        this.pet = pet;
    }

    public Boolean getPool() {
        return pool;
    }

    public void setPool(Boolean pool) {
        this.pool = pool;
    }

    public Boolean getStorage() {
        return storage;
    }

    public void setStorage(Boolean storage) {
        this.storage = storage;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    @Override
    public String toString() {
        return "Property{" +
                "id='" + id + '\'' +
                ", category='" + category + '\'' +
                ", title='" + title + '\'' +
                ", priceSale=" + priceSale +
                ", priceRent=" + priceRent +
                ", area='" + area + '\'' +
                ", size=" + size +
                ", bedrooms=" + bedrooms +
                ", bathrooms=" + bathrooms +
                ", images=" + images +
                ", distMetro=" + distMetro +
                ", elavator=" + elavator +
                ", floor=" + floor +
                ", garden=" + garden +
                ", parking=" + parking +
                ", pet=" + pet +
                ", pool=" + pool +
                ", storage=" + storage +
                ", year=" + year +
                '}';
    }
}
