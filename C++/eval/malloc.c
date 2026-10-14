#include <stdio.h>
#include <stdlib.h>

int sum(int *arr, int n)
{
    int sum = 0;

    for (int i = 0; i < n; i++)
    {
        sum += arr[i];
    }

    return sum;
}

int main()
{
    int n;

    printf("Enter the number of elements: ");
    scanf("%d", &n);

    if (n <= 0)
        return 0;

    int *p = malloc(n * sizeof(int));

    if (p == NULL)
        return 1;

    for (int i = 0; i < n; i++)
    {
        scanf("%d", &p[i]);
    }

    printf("The sum is %d\n", sum(p, n));

    free(p);

    return 0;
}