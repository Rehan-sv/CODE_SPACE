#include <stdio.h>
#include <ctype.h>

int main() {

    char str[200];

    printf("Enter a sentence: ");
    fgets(str, sizeof(str), stdin);

    int newWord = 1;

    for(int i = 0; str[i] != '\0'; i++) {

        if(isalpha(str[i])) {

            if(newWord)
                str[i] = toupper(str[i]);
            else
                str[i] = tolower(str[i]);

            newWord = 0;
        }

        else if(str[i] == ' ')
            newWord = 1;
    }

    printf("Sentence Case: %s", str);

    return 0;
}