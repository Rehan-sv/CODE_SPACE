package _Java.assignment;
import java.util.Scanner;

public class checking_numbers{
    public static void main(String[] args) {
        Scanner data = new Scanner(System.in);

        System.out.print("Enter a number: ");		
        int num = data.nextInt();

        if (num > 0) {
            System.out.println("Number is Positive");
        } else if (num < 0) {
            System.out.println("Number is Negative");
        } else {
            System.out.println("Number is Zero");
        }
    }
}
