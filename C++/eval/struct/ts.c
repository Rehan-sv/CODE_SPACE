#include <stdio.h>
#include <stdlib.h>

int sumEven(int *p, int n)
{
    if (n == 0)
        return 0;

    if (*(p + n - 1) % 2 == 0)
        return *(p + n - 1) + sumEven(p, n - 1);

    return sumEven(p, n - 1);
}

int countDigits(int n)
{
    if (n < 10)
        return 1;

    return 1 + countDigits(n / 10);
}

void sumNatural(int n, int *result)
{
    if (n == 0)
        *result = 0;
    else
        *result = n * (n + 1) / 2;
}

int main()
{
    int n, sum, digits, naturalSum;
    int *p;

    printf("Enter n: ");
    scanf("%d", &n);

    if (n <= 0)
    {
        printf("Invalid size\n");
        return 0;
    }

    p = malloc(n * sizeof(int));

    if (p == NULL)
    {
        printf("Memory allocation failed\n");
        return 1;
    }

    printf("Enter elements: ");

    for (int i = 0; i < n; i++)
        scanf("%d", p + i);

    sum = sumEven(p, n);

    digits = countDigits(abs(sum));

    sumNatural(digits, &naturalSum);

    printf("Sum of even numbers: %d\n", sum);
    printf("Number of digits: %d\n", digits);
    printf("Sum of natural numbers up to %d: %d\n",
           digits, naturalSum);

    free(p);

    return 0;
}

