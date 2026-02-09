package assignment_2;
import java.util.Scanner;
public class sum_even {

	public static void main(String[] args) {
		Scanner s=new Scanner(System.in);
		int n=s.nextInt();
		if(n%2==0) {
			for(int i =1;i<=n;i++) {
			   n=n+2*i;
			}
		}System.out.print(n);
	}

}
