//Multiplication table
import java.util.Scanner;

class MultiTable {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

  // Asking the user for the limit
       System.out.print("Enter the size of the table (e.g., 12): ");
        int limit = input.nextInt();

        System.out.println("\nMultiplication Table up to " + limit + "x" + limit + ":\n");

        // Outer loop for rows
        for (int i = 1; i <= limit; i++) {
            // Inner loop for columns
            for (int j = 1; j <= limit; j++) {
                // Formatting ensures columns stay straight
                System.out.printf("%4d", (i * j));
            }
            // New line after each row is complete
            System.out.println();
        }
        
        input.close();
    }
}