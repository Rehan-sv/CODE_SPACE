//Menu driven calculator using functions
package _Java.assignment;
import java.util.Scanner;

public class MenuCalculator {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int choice;
        double num1, num2;

        System.out.println("--- Welcome to the Java CLI Calculator ---");

        do {
            // Display Menu
            System.out.println("\nSelect an operation:");
            System.out.println("1. Addition (+)");
            System.out.println("2. Subtraction (-)");
            System.out.println("3. Multiplication (*)");
            System.out.println("4. Division (/)");
            System.out.println("5. Exit");
            System.out.print("Enter your choice: ");
            choice = scanner.nextInt();

            if (choice >= 1 && choice <= 4) {
                System.out.print("Enter first number: ");
                num1 = scanner.nextDouble();
                System.out.print("Enter second number: ");
                num2 = scanner.nextDouble();

                switch (choice) {
                    case 1:
                        System.out.println("Result: " + add(num1, num2));
                        break;
                    case 2:
                        System.out.println("Result: " + subtract(num1, num2));
                        break;
                    case 3:
                        System.out.println("Result: " + multiply(num1, num2));
                        break;
                    case 4:
                        divide(num1, num2);
                        break;
		    default:System.out.println("Invalid choice! Please try again.");

                }
            } 
          
        } while (choice != 5);

        System.out.println("Exiting... Goodbye!");
        scanner.close();
    }

    // Function for Addition
    public static double add(double a, double b) {
        return a + b;
    }

    // Function for Subtraction
    public static double subtract(double a, double b) {
        return a - b;
    }

    // Function for Multiplication
    public static double multiply(double a, double b) {
        return a * b;
    }

    // Function for Division with error handling
    public static void divide(double a, double b) {
        if (b == 0) {
            System.out.println("Error: Cannot divide by zero.");
        } else {
            System.out.println("Result: " + (a / b));
        }
    }
}