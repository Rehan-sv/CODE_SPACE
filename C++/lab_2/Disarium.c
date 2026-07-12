#include <stdio.h>

int power(int base, int exp) {
    int result = 1;

    for(int i = 1; i <= exp; i++)
        result *= base;

    return result;
}

int main() {
    int n, temp, digits = 0, sum = 0;

    printf("Enter a number: ");
    scanf("%d", &n);

    temp = n;

    while(temp != 0) {
        digits++;
        temp /= 10;
    }

    temp = n;

    int arr[20];

    for(int i = digits - 1; i >= 0; i--) {
        arr[i] = temp % 10;
        temp /= 10;
    }

    for(int i = 0; i < digits; i++)
        sum += power(arr[i], i + 1);

    if(sum == n)
        printf("%d is a Disarium Number", n);
    else
        printf("%d is NOT a Disarium Number", n);

    return 0;
}