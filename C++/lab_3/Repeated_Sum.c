#include <stdio.h>

int main()
{
    int T;
    scanf("%d",&T);

    while(T--)
    {
        int D,N;
        scanf("%d %d",&D,&N);

        while(D--)
        {
            N = N*(N+1)/2;
        }

        printf("%d\n",N);
    }

    return 0;
}