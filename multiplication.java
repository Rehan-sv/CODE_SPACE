package assignment_2;
import java.util.Scanner;
public class multiplication {

	public static void main(String[] args) {
		Scanner s = new Scanner(System.in);
		int mul;
		System.out.print("number u want to find the multiplication : ");
		int n = s.nextInt();
		for(int i=1;i<=10;i++) {
			mul=n*i;
			System.out.println("THe multi  tabel : "+mul);
		}
		

	}

}
