package _Java.exam;
import java.util.Scanner;
public class binary_dec {
    public static void main(String[]args){
        Scanner s= new Scanner(System.in);
        System.out.print("Enter the number ");
        int n=s.nextInt();
        int rev=0;
        while(n!=0){
            int digit =n % 10;
            rev=rev*10+digit;
            n=n/10;
        }
        System.out.print("Enter the number "+rev);


    }
    
}
