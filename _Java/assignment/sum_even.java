package _Java.assignment;
import java.util.Scanner;

public class sum_even {
    public static void main (String[]args){
        Scanner s =new Scanner(System.in);
        System.out.println("Enter the size");
        int n=s.nextInt();
        int sum=0;
        int arr[]= new int[n];
        for (int i =0;i<n;i++){
            System.out.println("Enter the numbers"+i);
            arr[i]= s.nextInt();                
        }
        for (int a:arr){
            System.out.println("The numbers r:"+a);
            if(a%2==0){
                sum+=a;
            }
        }
        System.out.println("The sum is:"+sum);




    }
    
}
