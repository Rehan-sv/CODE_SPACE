#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main() {

    char str[100];

    printf("Enter a string: ");
    scanf("%s", str);

    for(int i = 0; str[i] != '\0'; i++) {

        if(i % 2 == 0)
            str[i] = toupper(str[i]);
        else
            str[i] = tolower(str[i]);
    }

    printf("Sponge Case: %s", str);

    return 0;
}