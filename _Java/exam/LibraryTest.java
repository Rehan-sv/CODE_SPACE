import java.util.*;

class Book {
    String title;

    Book(String t) {
        title = t;
    }
}

public class LibraryTest {

    public static void main(String[] args) {

        Scanner s = new Scanner(System.in);

        Book[] library = new Book[3];

        for (int i = 0; i < library.length; i++) {

            System.out.println("Enter title for book " + i + " (or type 'none' for empty slot):");
            String t = s.nextLine();

            if (!t.equalsIgnoreCase("none")) {
                library[i] = new Book(t);
            }
        }

        for (int i = 0; i < library.length; i++) {

            if (library[i] != null)
                System.out.println("Book " + i + ": " + library[i].title);
            else
                System.out.println("Book " + i + ": [Empty Slot]");
        }
    }
}