#include <stdio.h>
#include <ctype.h>

int main()
{
    char s[100];
    int i, len = 0;

    printf("Enter the string: ");
    scanf("%s", s);

    while (s[len] != '\0')
    {
        len++; 
    }

    for (i = 0; i < len / 2; i++)
    {
        if (tolower(s[i]) != tolower(s[len - 1 - i]))
        {
            printf("Not a palindrome");
            return 0;
        }
    }

    printf("Palindrome");

    return 0;
}
