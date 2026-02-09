package _Java.assignment;
import java.util.Scanner;
public class Electricity_billing {
	public static void main(String[] args) {
		Scanner s = new Scanner(System.in);
		System.out.print("Enter the unit u consumed");
		int unit=s.nextInt();
		int date=10;
		double bill=10;
 
		System.out.print("Enter the date");
		int current_date=s.nextInt();
		if(current_date>date) {
			}
		if (unit <= 100) {
            bill = bill + (unit * 0.5);
        } 
        else if (unit <= 300) {
            bill = bill + (100 * 0.5) + ((unit - 100) * 0.75);
        } 
        else {
            bill = bill + (100 * 0.5) + (200 * 0.75) + ((unit - 300) * 1.2);
        }
        if (current_date > date){
            bill = bill + (bill * 0.05);
        }

        System.out.println("Total Bill: $" + bill);
		 

	}

	

}
