package _Java.assignment;

import java.util.Scanner;

public class char_count {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        int count = 0;

        while (sc.hasNext()) {
            String s = sc.next();
            count = count + s.length();
        }

        System.out.println(count);
        sc.close();
    }
}
