package _Java.practice;

import java.util.Scanner;
import java.util.Arrays;

public class ReverseArrayProgram {

    public static int[] reverseArray(int[] arr) {
        int n = arr.length;
        int[] rev = new int[n];

        for (int i = 0; i < n; i++) {
            rev[i] = arr[n - 1 - i];
        }

        return rev;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter size of array: ");
        int n = sc.nextInt();

        int[] a = new int[n];

        System.out.println("Enter elements:");
        for (int i = 0; i < n; i++) {
            a[i] = sc.nextInt();
        }

        int[] result = reverseArray(a);

        System.out.println("Original Array: " + Arrays.toString(a));
        System.out.println("Reversed Array: " + Arrays.toString(result));
    }
}
