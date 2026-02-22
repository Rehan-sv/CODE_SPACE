import java.util.Scanner;

public class TemperatureApp {

    public static void main(String[] args) {

        Scanner s = new Scanner(System.in);

        System.out.print("Enter size: ");
        int n = s.nextInt();

        Temperature t1 = new Temperature(n);  // Object created

        t1.inputTemperatures(s);
        t1.calculateAverage();
        t1.findMinMax();
        t1.checkAlert();

        s.close();
    }
}