package assignment_2;
import java.util.Scanner;

public class n_sum {
public static void main(String[] args) {
			Scanner s = new Scanner(System.in);
			System.out.print("Enter the n ");
			int n=s.nextInt();
			 int sum=0;
			 
			for (int i =1;i<=n;i++) {
				System.out.println(i);
				sum+=i;
				
			}
			System.out.println("THe sum is "+sum);
		

		}

	}


