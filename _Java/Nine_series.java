package _Java;

public class Nine_series {
    public static void main(String[] args){
        int n = 5;
        int s=0;
        int sum=0;
        for(int i=0;i<=n;i++){
            s = (s * 10) + 9;
            sum=sum+s;
        }
        System.out.print("The sum is :" + sum);
    }
    
}