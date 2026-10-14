#include <stdio.h>

int sumEven(int n){
    if(n==0){
        return;
    }
    if(n%2==0){
        return(n+sumEven(n/10));
    }
    return sumEven(n-1);
}

int count(int n,int *count ){


    if(n==0){
        *count=1;
        return;
    }
    if(n>0){
        count=count+1;
        n=n/10;
    }
    
    }
    int main(){
        int n;
        printf("enter the number");
        scanf("%d",&n);
        int evensum=sumEven(n);
        int countofDig=count(n,&count);
        printf("Sum of even numbers = %d\n", evensum);
        printf("Count of digits = %d\n", count);
        return 0;

    }
