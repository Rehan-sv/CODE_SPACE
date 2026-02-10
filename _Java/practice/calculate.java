package interset;
import java.util.Scanner;
public class calculate {
	public static void main(String[] args){
		Scanner data = new Scanner(System.in);
		System.out.print("Enter the principle");
		int p=data.nextInt();
		System.out.print("Enter the rate ");
		int r=data.nextInt();
		System.out.print("Enter the time ");
		int T=data.nextInt();
		int interest=(p*r*T)/100;
		System.out.print("THe result is "+interest);
		
	}

}
