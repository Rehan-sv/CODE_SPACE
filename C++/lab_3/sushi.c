    #include <stdio.h>

int main()
{
    int T;
    scanf("%d",&T);

    while(T--)
    {
        int N,K;

        scanf("%d %d",&N,&K);

        int A[N];

        for(int i=0;i<N;i++)
            scanf("%d",&A[i]);

        int sum=0;
        int count=0;

        for(int i=0;i<N;i++)
        {
            if(sum + A[i] <= K)
            {
                sum += A[i];
                count++;
            }
            else
            {
                break;
            }
        }

        printf("%d\n",count);
    }

    return 0;
}