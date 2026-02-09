package _Java.assignment;

import java.util.Scanner;

public class cosine {

    static long factorial(int n) {
        long fact = 1;
        for (int i = 1; i <= n; i++) {
            fact = fact * i;
        }
        return fact;
    }

    static double power(double x, int n) {
        double result = 1;
        for (int i = 1; i <= n; i++) {
            result = result * x;
        }
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter value of x: ");
        double x = sc.nextDouble();

        System.out.print("Enter number of terms: ");
        int terms = sc.nextInt();

        double sum = 0;
        int sign = 1;
        int powerValue = 0;

        for (int i = 0; i < terms; i++) {
            sum = sum + sign * (power(x, powerValue) / factorial(powerValue));
            sign = -sign;
            powerValue += 2;
        }

        System.out.println("Sum of cosine series: " + sum);
        sc.close();
    }
}
