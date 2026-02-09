package _Java.assignment;

public class Perfect_Numbers_In_Range {
    public static void main(String[] args) {

        for (int num = 1; num <= 50; num++) {
            int sum = 0;

            for (int i = 1; i <= num / 2; i++) {
                if (num % i == 0)
                    sum = sum + i;
            }

            if (sum == num)
                System.out.print(num + " ");
        }
    }
}
