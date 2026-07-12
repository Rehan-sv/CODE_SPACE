# include <stdio.h>
int main(){
    char number[16];
    printf("Enter 16 digit card number");
    scanf("%s",number);

    for(int i=0;i<12;i++){
        printf("*");
    }
    for(int j=12;j<=16;j++){
        printf("%c",number[j]);
    }
    return 0;
}