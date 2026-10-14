#include <stdio.h>
#include <stdlib.h>

void findMinMax(int *arr, int n, int *min, int *max)
{
    *min = arr[0];
    *max = arr[0];

    for (int i = 1; i < n; i++)
    {
        if (arr[i] > *max)
        {
            *max = arr[i];
        }

        if (arr[i] < *min)
        {
            *min = arr[i];
        }
    }
}

int main()
{
    int n, min, max;

    printf("Enter the number of elements: ");
    scanf("%d", &n);

    if (n <= 0)
        return 0;

    int *p = malloc(n * sizeof(int));

    if (p == NULL)
        return 1;

    printf("Enter the elements: ");

    for (int i = 0; i < n; i++)
    {
        scanf("%d", &p[i]);
    }

    findMinMax(p, n, &min, &max);

    printf("Minimum = %d\n", min);
    printf("Maximum = %d\n", max);

    free(p);

    return 0;
}

