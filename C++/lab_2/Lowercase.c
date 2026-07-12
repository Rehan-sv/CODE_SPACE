#include <stdio.h>
#include <ctype.h>

int main() {

    char str[100];

    printf("Enter a string: ");
    scanf("%s", str);

    printf("Output: ");

    for(int i = 0; str[i] != '\0'; i++)
        if(islower(str[i]))
            printf("%c", str[i]);


    for(int i = 0; str[i] != '\0'; i++)
        if(isupper(str[i]))
            printf("%c", str[i]);

    for(int i = 0; str[i] != '\0'; i++)
        if(isdigit(str[i]) && ((str[i]-'0')%2==1))
            printf("%c", str[i]);

    for(int i = 0; str[i] != '\0'; i++)
        if(isdigit(str[i]) && ((str[i]-'0')%2==0))
            printf("%c", str[i]);

    return 0;
}