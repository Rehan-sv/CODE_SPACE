package _Java.OOPS;

public class Book_OOPS {
    class Book {
    private String title;
    private String author;
    private double price;

    // No-argument constructor
    public Book() {
        this.title = "Not Available";
        this.author = "Not Available";
        this.price = 0.0;
    }

    // Parameterized constructor
    public Book(String title, String author, double price) {
        this.title = title;
        this.author = author;
        this.price = price;
    }

    // Method to update details
    public void setDetails(String title, String author, double price) {
        this.title = title;
        this.author = author;
        this.price = price;
    }

    // Method to display details
    public void displayDetails() {
        System.out.println("Title: " + title);
        System.out.println("Author: " + author);
        System.out.println("Price: " + price);
        System.out.println();
    }
}

    
}
