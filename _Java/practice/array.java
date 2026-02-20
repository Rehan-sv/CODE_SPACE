// package _Java.practice;
// import java.util.Scanner;

// public class array {
//     public static void main(String[] args){
//         Scanner s =new Scanner(System.in);
//         System.out.println("Enter the size: ");  
//         int n =s.nextInt();

//         int arr[]=new int[n];

//         for(int i =0;i<n;i++){
//             System.out.println("Enter the number: ");
//             arr[i] =s.nextInt();
//         }
//         System.out.println("The elements are: ");
//         for (int a:arr){
//             System.out.println(a);
//         }
//     }
// }

// 1: SUm of the elements

// int[] arr = {10, 20, 30};
// int sum = 0;

// for(int num : arr) {
//     sum += num;
// }

// System.out.println("Sum = " + sum);

// 2: largest number ++++

// int[] arr = {10, 50, 20};

// int max = arr[0];

// for(int num : arr) {
//     if(num > max) {
//         max = num;
//     }
// }
// System.out.println("Largest = " + max);

// 3) Search an element 
// int key = 20;
// boolean found = false;

// for(int num : arr) {
//     if(num == key) {
//         found = true;
//         break;
//     }
// }

// if(found)
//     System.out.println("Found");
// else
//     System.out.println("Not Found");