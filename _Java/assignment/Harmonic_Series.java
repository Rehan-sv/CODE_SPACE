package _Java.assignment;
import java.util.Scanner;

public class Harmonic_Series {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter number of terms: ");
        int n = sc.nextInt();

        double sum = 0;

        for (int i = 1; i <= n; i++) {
            sum = sum + (1.0 / i);
        }

        System.out.println("Sum: " + sum);
        sc.close();
    }
}
