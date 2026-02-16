public class Books {
    private String title;
    private String author;
    private double price;

    // No-argument constructor
    public Books() {
        this.title = "Not Available";
        this.author = "Not Available";
        this.price = 0.0;
    }

    // Parameterized constructor
    public Books(String title, String author, double price) {
        this.title = title;
        this.author = author;
        this.price = price;
    }

    public void setDetails(String title, String author, double price) {
        this.title = title;
        this.author = author;
        this.price = price;
    }

    public void displayDetails() {
        System.out.println("Title: " + title);
        System.out.println("Author: " + author);
        System.out.println("Price: " + price);
        System.out.println();
    }
}
