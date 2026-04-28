import java.util.Scanner;
import java.io.*;

public class file {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        try {

            // Append mode
            FileWriter fw = new FileWriter("donations.txt", true);

            System.out.println("Enter first book title:");
            String book1 = sc.nextLine();
            fw.write(book1 + "\n");

            System.out.println("Enter second book title:");
            String book2 = sc.nextLine();
            fw.write(book2 + "\n");

            fw.close();

            System.out.println("Successfully logged.\n");

            // Reading file
            BufferedReader br = new BufferedReader(new FileReader("donations.txt"));

            String line;
            int count = 0;

            System.out.println("Current Donation List:\n");

            while ((line = br.readLine()) != null) {
                count++;
                System.out.println(count + ". " + line);
            }

            br.close();

            System.out.println("\nTotal Books: " + count);

        }

        catch (IOException e) {
            System.out.println("File error occurred.");
        }

        sc.close();
    }
}