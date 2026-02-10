package _Java;
import java.util.Scanner;

public class leap {
    public static boolean leadYear(int year){
        if(year%400==0){
            return true;
        }
        else if(year%100==0){
            return false;
        }
        else{
            return year%4==0;
        }

    }
    
    public static void main(String[] args){
        Scanner data=new Scanner(System.in);
        int year=data.nextInt();
        boolean result=leadYear(year);
        System.out.println(result);



    }
    
}
