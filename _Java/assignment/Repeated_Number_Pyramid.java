package _Java.assignment;

public class Repeated_Number_Pyramid {
    public static void main(String[] args) {
        for (int i = 1; i <= 3; i++) {
            for (int space = 3; space > i; space--) {
                System.out.print(" ");
            }
            for (int j = 1; j <= i; j++) {
                System.out.print(i + " ");
            }
            System.out.println();
        }
    }
}
