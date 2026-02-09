package _Java.assignment;

import java.util.Scanner;

public class Gp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        double a = sc.nextDouble();
        int n = sc.nextInt();
        double r = sc.nextDouble();

        double sum = a * (Math.pow(r, n) - 1) / (r - 1);
        System.out.println(sum);

        sc.close();
    }
}
