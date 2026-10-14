#include <stdio.h>
#include <stdlib.h>

void swap(int *a, int *b)
{
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main()
{
    int n;
    int *arr;

    printf("Enter the size: ");
    scanf("%d", &n);

    arr = malloc(n * sizeof(int));

    printf("Enter the elements: ");

    for (int i = 0; i < n; i++)
    {
        scanf("%d", &arr[i]);
    }

    swap(&arr[0], &arr[n - 1]);

    printf("After swapping: ");

    for (int i = 0; i < n; i++)
    {
        printf("%d ", arr[i]);
    }

    free(arr);

    return 0;
}