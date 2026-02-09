package _Java.assignment;

public class pascal {
    public static void main(String[] args) {
        int n = 5;
        for (int i = 0; i < n; i++) {
            int value = 1;
            for (int space = n; space > i; space--)
                System.out.print(" ");
            for (int j = 0; j <= i; j++) {
                System.out.print(value + " ");
                value = value * (i - j) / (j + 1);
            }
            System.out.println();
        }
    }
}
