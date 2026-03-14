package _Java.exam;
import java.util.Scanner;
public class fact {
    public static void main (String[]args){
        Scanner s=new Scanner ( System.in);
        System.out.print("enter the numeber");
        int n =s.nextInt();
        int fact=1;
        for(int i=1 ;i<=n;i++){
            fact*=i;
        }
        System.out.print("enter the numeber"+fact);
    }

    
}
