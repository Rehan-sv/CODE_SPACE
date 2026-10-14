#include <stdio.h>

int length(char s[], int i)
{
    if (s[i] == '\0')
    {
        return 0;
    }

    return 1 + length(s, i + 1);
}

int main()
{
    char s[100];

    printf("Enter the string: ");
    scanf("%99s", s);

    printf("Length = %d\n", length(s, 0));

    return 0;
}