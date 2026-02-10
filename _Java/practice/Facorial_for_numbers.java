package factorial;
import java.util.Scanner;
public class Facorial_for_numbers {
	public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int num;
        int factorial = 1;

        System.out.print("Input the number: ");
        num = sc.nextInt();

        for (int i = 1; i <= num; i++) {
            factorial = factorial * i;
        }

        System.out.println("The Factorial of " + num + " is: " + factorial);
    }
}



