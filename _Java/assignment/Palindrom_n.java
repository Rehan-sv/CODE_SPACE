package _Java.assignment;

public class Palindrom_n {
    public static void main(String[] args) {
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= i; j++)
                System.out.print(j);

            for (int j = i - 1; j >= 1; j--)
                System.out.print(j);

            System.out.println();
        }
    }
}
