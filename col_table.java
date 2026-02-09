package assignment_2;
import java.util.Scanner;
public class col_table {

	    public static void main(String[] args) {
	        Scanner input = new Scanner(System.in);

	       System.out.print("Enter limit for  the table : ");
	        int a = input.nextInt();

	        System.out.println("Multiplication Table up to " + a + "x" + a + ":\n");


	        for (int i = 1; i <= 10; i++) {

	            for (int j = 1; j <= a; j++) {
	        
	                System.out.printf("%4d", (i * j));
	            }
	            System.out.println();
	        }
	        
	        input.close();
	    }
	}

