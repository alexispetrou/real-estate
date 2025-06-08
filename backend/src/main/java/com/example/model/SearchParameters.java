package com.example.model;

public class SearchParameters {
    private String type;
    private String category;
    private String area;
    private Long minPrice;
    private Long maxPrice;
    private Long minSize;
    private Long maxSize;

    public SearchParameters(String category, String type, String area, Long minPrice, Long maxPrice,
            Long minSize, Long maxSize) {
        this.category = category;
        this.type = type;
        this.area = area;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.minSize = minSize;
        this.maxSize = maxSize;

    }

    public SearchParameters() {
    }

    // Getters & Setters
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = (category != null) ? category.trim() : null;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = (type != null) ? type.trim() : null;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = (area != null) ? area.trim() : null;
    }

    public Long getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(Long minPrice) {
        this.minPrice = minPrice;
    }

    public Long getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(Long maxPrice) {
        this.maxPrice = maxPrice;
    }

    public Long getMinSize() {
        return minSize;
    }

    public void setMinSize(Long minSize) {
        this.minSize = minSize;
    }

    public Long getMaxSize() {
        return maxSize;
    }

    public void setMaxSize(Long maxSize) {
        this.maxSize = maxSize;
    }

    @Override
    public String toString() {
        return "SearchParameters{" +
                "category='" + category + '\'' +
                ", type='" + type + '\'' +
                ", area='" + area + '\'' +
                ", minPrice=" + minPrice +
                ", maxPrice=" + maxPrice +
                ", minSize=" + minSize +
                ", maxSize=" + maxSize +
                '}';
    }
}
