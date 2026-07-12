#include <stdio.h>

int main()
{
    int a[7];
    int sum = 0;

    printf("Enter 7 numbers:\n");

    for(int i = 0; i < 7; i++)
    {
        scanf("%d", &a[i]);
    }

    printf("Array elements are: ");

    for(int i = 0; i < 7; i++)
    {
        printf("%d ", a[i]);
    }

    for(int j = 0; j < 7; j++)
    {
        sum = sum + a[j];
    }

    printf("\nSum = %d", sum);

    return 0;
}