package _Java.assignment;
public class piramid_number {
    public static void main(String[] args){
int n = 3;
int num = 1;

for(int i=1;i<=n;i++){
    for(int s=n-i; s>0; s--) System.out.print(" ");
    for(int j=1;j<=i;j++){
        System.out.print(num + " ");
        num++;
    }
    System.out.println();
    }
    }
}   