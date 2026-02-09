package _Java.assignment;

import java.util.Scanner;

public class Exponential_Series {
    static long factorial(int n) {
        long f = 1;
        for (int i = 1; i <= n; i++)
            f = f * i;
        return f;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double x = sc.nextDouble();
        int n = sc.nextInt();

        double sum = 0;
        for (int i = 0; i < n; i++) {
            sum = sum + (Math.pow(x, i) / factorial(i));
        }
        System.out.println(sum);
        sc.close();
    }
}
