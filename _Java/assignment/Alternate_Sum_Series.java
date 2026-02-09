package _Java.assignment;

import java.util.Scanner;

public class Alternate_Sum_Series {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int x = sc.nextInt();
        int n = sc.nextInt();

        int sum = 0;
        int power = 1;
        int sign = 1;

        for (int i = 0; i < n; i++) {
            sum = sum + sign * (int)Math.pow(x, power);
            sign = -sign;
            power += 2;
        }

        System.out.println(sum);
        sc.close();
    }
}
