package _Java.exam;
import java.util.Arrays;
import java.util.Scanner;
public class rev_arr {
    public static void main (String[]args){
        Scanner s = new Scanner (System.in);
        System.out.println("Enter the size ");
        int n=s.nextInt();
        int []arr= new int[n];

        for(int i=0;i<n;i++){
            arr[i]=s.nextInt();
        }
        int []rev =new int[n];
        for(int i =0;i<n;i++){
            rev[i]=arr[n-i-1];
        }
        System.out.println(Arrays.toString(rev));
    }
    
}
