package _Java.assignment;
import java.util.Scanner;
public class main_q1 {
    public static void main (String[]args){
        Scanner sc=new Scanner (System.in);
        System.out.println("Enter the no title");
        int n=sc.nextInt();
        q1[] movies =new q1[n];
        for(int i=1;i<n;i++){
        System.out.print("Rank: ");
            int rank = sc.nextInt();
            sc.nextLine();

            System.out.print("Title: ");
            String title = sc.nextLine();

            System.out.print("Distributor: ");
            String dec = sc.nextLine();

            System.out.print("Worldwide Gross: ");
            long world = sc.nextLong();
            
        }


    }
    
}
