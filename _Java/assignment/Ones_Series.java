package _Java.assignment;

import java.util.Scanner;

public class Ones_Series {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = sc.nextInt();
        int term = 0;
        int sum = 0;

        for (int i = 1; i <= n; i++) {
            term = term * 10 + 1;
            sum = sum + term;
        }

        System.out.println(sum);
        sc.close();
    }
}
