package _Java.practice;
import java.util.Scanner;
public class Temparature {
    public static void main(String[] args){
        Scanner s=new Scanner(System.in);
        System.out.print("Enter the size ");
        int n=s.nextInt();
        double hourlyTemperatures []=new double [n];
        double sum=0;
        double avg=0;
        double max=0;
        double min=0;
        for(int i=0;i<n;i++){
            System.out.print("Enter the temperatures"+i+":");
            hourlyTemperatures[i]=s.nextDouble();
        }

        for(double x :hourlyTemperatures){
            sum+=x;
        }
        avg=sum/n;
        System.out.println("The avg is :"+avg);


    for(double x:hourlyTemperatures){
        if (x>max){
            max=x;
        }
        if(x<min){
            min=x;
            
        }
    }
    System.out.println("The max temp is :"+max);
    System.out.println("The min temp is :"+min);

    for(double x: hourlyTemperatures){
        boolean alert = false;
        if(x > 35){
        alert = true;
        break;
            }
            if(alert){
            System.out.println("⚠ ALERT: Open ventilation windows!");
        } else {
            System.out.println("Temperature is under control.");
        }

    }
    s.close();


    }
    
}
