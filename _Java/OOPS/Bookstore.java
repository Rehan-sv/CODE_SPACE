package _Java.OOPS;
public class Bookstore {
    public static void main(String[] args) {

        // Object using no-argument constructor
        Book book1 = new Book();
        System.out.println("Book Details (Default Constructor):");
        book1.displayDetails();

        // Object using parameterized constructor
        Book book2 = new Book("The Java Handbook", "Patrick Naughton", 500.0);
        System.out.println("Book Details (Parameterized Constructor):");
        book2.displayDetails();

        // Updating first book details
        book1.setDetails("Effective Java", "Joshua Bloch", 800.0);
        System.out.println("Updated Book Details:");
        book1.displayDetails();
    }
}
