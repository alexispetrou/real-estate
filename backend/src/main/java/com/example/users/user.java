package com.example.users;

public class user {
    private String username;
    private String role;
    private String firstName; 
    private String lastName; 
    private final  String id;

    public user(String username, String role, String firstName, String lastName, String id) {
        this.username = username;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getId() {
        return id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

 

    @Override
    public String toString() {
        return "User{" +
               "username='" + username + '\'' +
               ", role='" + role + '\'' +
               ", firstName='" + firstName + '\'' +
               ", lastName='" + lastName + '\'' +
               ", id='" + id + '\'' +
               '}';
    }
}