package _Java.assignment;

public class LCM {
    public static void main(String[] args) {
        int a = 15, b = 20;
        int hcf = 1;

        for (int i = 1; i <= a && i <= b; i++) {
            if (a % i == 0 && b % i == 0)
                hcf = i;
        }

        int lcm = (a * b) / hcf;
        System.out.println(lcm);
    }
}
