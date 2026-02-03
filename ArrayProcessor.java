//Menu driven procgram to sort and search an array
import java.util.Scanner;


public class ArrayProcessor {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter the size of the array: ");
        int n = sc.nextInt();
        int[] arr = new int[n];

        //Read array elements
        System.out.println("Enter " + n + " elements:");
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
	
	int choice;
        do {
            System.out.println("\n--- Array Operations Menu ---");
            System.out.println("1. Display Array");
            System.out.println("2. Sort Array (Bubble Sort)");
            System.out.println("3. Search Element (Linear Search)");
            System.out.println("4. Exit");
            System.out.print("Enter choice: ");
            choice = sc.nextInt();

            switch (choice) {
                case 1:
                    display(arr);
                    break;
                case 2:
                    bubbleSort(arr);
                    System.out.println("Array sorted successfully.");
                    break;
                case 3:
                    System.out.print("Enter element to search: ");
                    int key = sc.nextInt();
                    // Linear search requires a sorted array
                    int result = linearSearch(arr, key);
                    if (result == -1) 
                        System.out.println("Element not found. (Ensure array is sorted!)");
                    else 
                        System.out.println("Element found at index: " + result);
                    break;
                case 4:
                    System.out.println("Exiting...");
                    break;
                default:
                    System.out.println("Invalid choice!");
            }
        } while (choice != 4);
        sc.close();
    }

    

    // Bubble Sort Function
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap elements
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    
// Linear Search Function
public static int linearSearch(int[] arr, int key) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == key) {
            return i; // Return the index if found
        }
    }
    return -1; // Return -1 if not found
}
}