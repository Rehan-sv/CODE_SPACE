
#include <stdio.h>

void swap(char *a, char *b)
{
    char temp = *a;
    *a = *b;
    *b = temp;
}

int main()
{
    char s[100];
    int len = 0;

    printf("Enter the string: ");
    scanf("%99s", s);

    while (s[len] != '\0')
    {
        len++;
    }

    if (len >= 2)
    {
        swap(&s[0], &s[len - 1]);
    }

    printf("After swapping: %s\n", s);

    return 0;
}

