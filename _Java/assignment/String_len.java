package _Java.assignment;

import java.util.Scanner;

public class String_len {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        String s = "welcome";
        int count = 0;

        for (char ch : s.toCharArray()) {
            count++;
        }

        System.out.println(count);

        sc.close();
    }
}
