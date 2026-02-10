package _Java;

import java.util.Scanner;

public class FactorialProgram {

    public static long findFactorial(int n) {

        if (n == 0) {
            return 1;
        }

        long fact = 1;

        for (int i = 1; i <= n; i++) {
            fact = fact * i;
        }

        return fact;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter a number: ");
        int num = sc.nextInt();

        long result = findFactorial(num);
        System.out.println("Factorial: " + result);
    }
}
