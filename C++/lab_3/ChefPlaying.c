#include <stdio.h>

int main()
{
    int T;
    scanf("%d",&T);

    while(T--)
    {
        int X,Y,Z;

        scanf("%d %d %d",&X,&Y,&Z);

        int total = X*Y;

        int breaks = (X-1)/3;

        total = total + breaks*Z;

        printf("%d\n",total);
    }

    return 0;
}