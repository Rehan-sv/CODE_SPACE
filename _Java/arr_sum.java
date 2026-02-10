package _Java;
import java.util.Scanner;
public class arr_sum {
    public static void main(String[]args){
        Scanner s=new Scanner(System.in);
        System.out.println("Enter the size of array u want to :");
        int n=s.nextInt();

        int [] arr = new int[n];
        System.out.println("Enter the numbers");
        for(int i=0;i<n;i++){
            arr[i]=s.nextInt();
        }
        int sum=0;
        for(int j=0;j<n;j++){
            if(arr[j]%2==0){
            sum=sum+arr[j];
            }   
        }System.out.println("THe sum is "+sum);
    }
    
}
