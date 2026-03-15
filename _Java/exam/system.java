 import java.util.Scanner;
 class grading {
    String name;
    int [] marks;

    grading(String n,int[] m){
        name =n;
        marks=m;
    }
}
public class system{
    public static void main(String[] args) {
    Scanner s =new Scanner(System.in);
    System.out.println("Enter the sizw of array u want ");
    int size=s.nextInt();
    grading[] student =new grading[size];
    for(int i=0;i<size;i++){
        System.out.println("Enter the name "+i+1);
        String name =s.nextLine();
    int [] marks=new int[size];
    for (int j=0;j<size;j++){
        System.out.println("ENter the marks"+i+1);
        marks[j]=s.nextInt();
    }
    student[i]=new grading(name, marks);
   }
   int sum=0;
   double totalavg=0;
   for (int i=0;i<size;i++){
    for (int j=0;j<size;j++){
        sum+=student[i].marks[j];
    }
    double avg=sum/size;
    System.out.println("The avg is "+avg);
    totalavg+=avg;
   }
   System.out.println("The total Avg is "+totalavg);

    }
    
}
