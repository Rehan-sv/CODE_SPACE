#include <stdio.h>

int main()
{
    int T;
    scanf("%d",&T);

    while(T--)
    {
        int N;
        scanf("%d",&N);

        int A[N],B[N];

        for(int i=0;i<N;i++)
            scanf("%d",&A[i]);

        for(int i=0;i<N;i++)
            scanf("%d",&B[i]);

        int count=0;

        for(int i=0; i<N; i++)
        {
            int available;

            if(i==0)
                available=A[0];
            else
                available=A[i]-A[i-1];

            if(B[i]<=available)
                count++;
        }
        printf("%d\n",count);
    }

    return 0;
}