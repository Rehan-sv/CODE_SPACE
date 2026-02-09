package _Java.assignment;

public class HCF{
    public static void main(String[] args) {
        int a = 24, b = 28;
        int hcf = 1;

        for (int i = 1; i <= a && i <= b; i++) {
            if (a % i == 0 && b % i == 0)
                hcf = i;
        }

        System.out.println(hcf);
    }
}
