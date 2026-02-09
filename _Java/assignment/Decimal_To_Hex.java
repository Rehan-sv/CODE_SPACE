package _Java.assignment;

public class Decimal_To_Hex {
    public static void main(String[] args) {
        int num = 79;
        String hex = "";

        char[] hexChars = 
        {'0','1','2','3','4','5','6','7','8','9',
         'A','B','C','D','E','F'};

        while (num > 0) {
            int rem = num % 16;
            hex = hexChars[rem] + hex;
            num /= 16;
        }

        System.out.println(hex);
    }
}
