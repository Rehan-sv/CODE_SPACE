package _Java.assignment;

public class sum_avg{
    public static void main(String[] args) {

        double[] numbers = {2, 4, 6, 8, 10, 12, 14, 16, 18, 2};
        double sum = 0;

        for (int i = 0; i < numbers.length; i++) {
            sum = sum + numbers[i];
        }

        double average = sum / numbers.length;

        System.out.println("Sum: " + sum);
        System.out.println("Average: " + average);
    }
}
