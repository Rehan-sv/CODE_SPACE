package _Java.assignment;
import java.util.Scanner;
public class lab_1 {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int i, n;
        int term = 0;
        int sum = 0;

        System.out.print("Enter i: ");
        i = sc.nextInt();

        System.out.print("Enter number of terms n: ");
        n = sc.nextInt();

        for(int j = 1; j <= n; j++) {
            term = term * 10 + i;
            sum = sum + term;
        }

        System.out.println("Sum = " + sum);
    }
}
    

