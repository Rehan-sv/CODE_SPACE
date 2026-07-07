#include<iostream>
using namespace std;
int main()
{ 
    int n;
	cout<<"enter the number to get fibonacci series:";
	cin>>n; 
	int a[n];
	if(n==0 || n==1)
	{
		cout<<"0 1";
	}
	else{
		a[0]=0;
		a[1]=1;
		int f=0;
		for(int i=2;i<=n;i++){
			a[i]=a[i-1]+a[i-2];
		}
		for(int i=0;i<=n;i++){
		cout<<a[i]<<" ";
	}
	
	}

	
}