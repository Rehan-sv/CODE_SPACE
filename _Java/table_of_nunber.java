package _Java;
import java.util.Scanner;

public class table_of_nunber {
    public static void main(String[] args){
        Scanner s=new Scanner(System.in);
        System.out.print("enter the number for table");
        int n=s.nextInt();
        for(int i=1;i<=10;i++){
            int m=n*i;
            System.out.println(""+n+" *  "+ i+" =" + m);
        }
        s.close();

    }
}
        


    

