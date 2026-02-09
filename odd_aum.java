package assignment_2;
import java.util.Scanner;
public class odd_aum {

	public static void main(String[] args) {
		Scanner s = new Scanner(System.in);
		System.out.print("Enter the number u want: ");
		int n = s.nextInt();
		int num =s.nextInt();
		if ( n%2!=0) {
			System.out.println("the number is Odd");
			for(int i =1;i<=num;i++) {
				int sum=i+2;
				System.out.println("The sum of the odd number are " + sum);

			}
	

				
			}
		}
	}

