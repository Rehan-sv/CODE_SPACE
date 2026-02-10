package _Java;
import java.util.Scanner;
public class arr_fn_Sum {

    public static int sumEvenNumbers(int[] arr) {
        int sum = 0;

        for (int i = 0; i < arr.length; i++) {
            if (arr[i] % 2 == 0) {   
                sum = sum + arr[i];
            }
        }
        return sum;
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

        int result = sumEvenNumbers(a);

        System.out.println("Sum of even numbers: " + result);
    }
}
