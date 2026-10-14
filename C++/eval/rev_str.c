
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

    for (int i = 0; i < len / 2; i++)
    {
        swap(&s[i], &s[len - 1 - i]);
    }

    printf("Reversed string: %s\n", s);

    return 0;
}
