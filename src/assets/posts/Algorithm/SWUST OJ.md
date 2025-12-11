---
title: "SWUST OJ"
createdAt: "2024-04-18T10:30:00"
updatedAt: "2025-12-11T14:20:00"
---

# 作业二

## 1285

题目描述：
从键盘输入一个字符，根据输入字符的ASCII码判断字符类型。
ASCII码值小于32的为控制字符，输出"This is a control character."；
在'0'到'9'之间的为数字，输出"This is a digit."；
在'A'到'Z'之间的为大写字母，输出"This is a capital letter."；
在'a'到'z'之间的为大写字母，输出"This is a small letter."；
其余为其它字符，输出"This is an other character."

```c
#include<stdio.h>

int main()
{
	char a;
	scanf("%c",&a);
	int ch;
	ch =(int)a; //这个转换是必要的，char 类型在某些平台和编译器设置下实际上是一个小的整数类型，所以直接将字符与整数进行比较可能会导致错误或不预期的行为。
	
	if(ch <32)
	{
		printf("This is a control character.");
	}
	else if(ch>='0'&& ch<='9')
	{
		printf("This is a digit.");
	}
	else if(ch>='A' && ch<='Z')
	{
		printf("This is a capital letter.");
	}
	else if(ch>='a' && ch<='z')
	{
		printf("This is a small letter.");
	}
	else
	{
		printf("This is an other character.");
	}
	
	return 0;
}
```

## 1286

题目描述
从键盘输入一个正整数，判断该数是偶数还是奇数。
如果是偶数，则输出"even number",如果是奇数，则输出"odd number"。

```c
#include<stdio.h>

int main()
{
	int num;
	scanf("%d",&num);
	int ans = num%2;
	switch(ans)
	{
		case 1:
			printf("odd number");
			break;
		case 0:
			printf("even number");
			break;
		
	}
	return 0;
}
```

# 作业三

## 1287

题目描述
小明有n本书，他的好朋友小红、小新、小林想向小明借书，若每人只能借一本书，可以有多少种不同的借法？

```c
#include <stdio.h>  
int main(void)  
{  
	int n;
	scanf("%d",&n);
	int A,B,C;
	for(A=1;A<=n;A++)
	{
		for(B=1;B<=n;B++)
		{
			for(C=1;C<=n;C++)
			{
				if(C!=B && C!=A && A!=B)
				{
					printf("A:%d B:%d C:%d\n",A,B,C);
					
				}
			}
		}
		
	}
	printf("%d",n*(n-1)*(n-2)); //这题巨坑，最后这个不用加换行加了就是错的
    return 0;  
}

```

## 1288

题目描述
输出n1到n2之间的素数。

### tips:

这题用到了很多循环，容易犯错，因为没事先想好每个循环的作用，就容易不知不觉犯逻辑上的错误，比如for循环体范围过大或者过小。

```c
#include<stdio.h>

int main()
{
	int n1,n2,a;
	int k;
	int m=0;
	scanf("%d %d",&n1,&n2);
	
	for(a=n1;a<=n2;a++){
		
		k=0;
		
        for(int i =2;i<a;i++){
		
		if(a%i==0) //判断能否被整除，如果能就不是素数，标志k就++
		    k++;
	    }
		if(k==0){
			printf("%d ",a);	
			m++;	
		if(m%5==0){
			printf("\n"); //每五个输出一行
		}
		
     	}
	}	
	return 0;
}
```

# 作业四

## 171

题目描述

设计函数，实现字符串的倒序输出。

### tips：

需要注意数组下标问题

```c
#include <stdio.h>
#include <string.h>

int main()
{
	char s[100];
	while(~scanf("%s", s))   //特别的一点就是实现了多组样例输入
	{
		int n;
		n=strlen(s);
		for(int i=n-1; i>=0; i--) //i = n-1！！
		{
			printf("%c", s[i]);
		}
		printf("\n");
	}
	return 0;
} 
```



## 563

题目描述

将下面的字符串中的大小写进行转换．

```C
#include <stdio.h>
#include <string.h>

int main()
{
	char a[100]={'0'};  //需要初始化，不然会有点问题
	scanf("%s",a);
	
	int len = strlen(a);
	
	for(int i=0;i<len;i++){ 
		if(a[i]<='z' && a[i]>='a'){ //小写的字母ASCII反而更大
			a[i] = a[i]-32;
		}
		else if(a[i]<='Z' && a[i]>='A'){
			a[i] =a[i]+32;
		}
	}
	printf("%s\n",a);

	return 0;
}
```



## 1167

题目描述

分离字符串中的不同字符单独成行输出

```C
#include <stdio.h>
#include <string.h>
//依据ASCII来进行分类判断
int main()
{
	char s[205];
	while(~scanf("%s", s))
	{
		int n;
		n = strlen(s);
		char a[205] = "", b[205] ="", c[205] = ""; //初始化
		int d = 0, e = 0, f = 0;
		for(int i=0; i<n; i++)
		{
			if(s[i] >= 'A' && s[i] <= 'Z' || s[i] >= 'a' && s[i] <= 'z') 
			{
				a[d] = s[i];
				d++;
			}
			else if(s[i] >= '0' && s[i] <= '9')
			{
				b[e] = s[i];
				e++;
			}
			else
			{
				c[f] = s[i];
				f++;
			}
		}
		printf("%s\n%s\n%s\n", a, b,c );
	}
	return 0;
}
```



## 1178*

题目描述

在情报传递过程中，为了防止情报被截获，往往需要对情报用一定的方式加密，简单的加密算法虽然不足以完全避免情报被破译，但仍然能防止情报被轻易的识别。我们给出一种最简的的加密方法，对给定的一个字符串，把其中从a-y，A-Y的字母用其后继字母替代，把z和Z用a和A替代，其他非字母字符不变，则可得到一个简单的加密字符串。

```c++
#include <iostream>
#include <string>
using namespace std;
int main()
{
	string firch;
	while (getline(cin,firch))
	{
		string::iterator it1 = firch.begin();
		while (it1 != firch.end())
		{
			if (*it1 == 'z')
			{
				cout << 'a';
				it1++;
				continue;
			}
			if (*it1 == 'Z')
			{
				cout << 'A';
				it1++;
				continue;
			}
			if ((*it1 >= 'a'&&*it1 < 'z') || (*it1 >= 'A'&&*it1 < 'Z'))
				cout << ++(*it1);
			else
				cout << *it1;
			it1++;
 
		}
		cout << endl;
	}
	return 0;
}
```

```c
#include <stdio.h>
#include <string.h>

int main()
{
	int sum;
	char a[100];
	while(~scanf("%s", a))
	{
		sum = strlen(a);
		for(int i=0; i<sum; i++)
		{
			if(a[i] >= 'a' && a[i] <= 'y' || a[i] >= 'A' && a[i] <= 'Y')
				a[i] = a[i] + 1;
			else if(a[i] == 'z')
				a[i] = a[i] - 25;
			else if(a[i] == 'Z')
				a[i] = a[i] - 25;
		}
		printf("%s\n", a);
	}
	return 0;
}
```

### tips：

1.多组测试：while(~scanf()){}；
2.初始化数组长度之后，要通过strlen（）获得数组准确长度（不包括尾部\0的长度），才方便后续填充数组值，以此方便循环；
3.这里转换字母直接加减数字就好，用（int）强制转换后加减就通不过，虽然运行结果是一样的，应该是类型大小的锅。

# 作业五

## 580

题目描述
您的任务是从下面的数据中区分人口发生变化的国家，并按降序排序，然后返回人口数量没有变化的国家的变化值和名称。

```c
#include <stdio.h>
#include <string.h>

struct country{
	char name[100];
	int begin,after,result;
};
int main()
{	
	struct country ct[100];
	struct country t;
	int n =0;
	scanf("%d",&n);
	for(int i=0;i<n;i++){
		scanf("%s",ct[i].name);
	}
	for(int i=0;i<n;i++){
		scanf("%d",&ct[i].begin);
	}
	for(int i=0;i<n;i++){
		scanf("%d",&ct[i].after);
	}
	for(int i=0;i<n;i++){
		ct[i].result =ct[i].after-ct[i].begin ;
	}	 
	
	for(int i=0; i<n-1; i++)
    {
       for(int j=i; j<n; j++)
        {
            if(ct[i].result < ct[j].result)
            {
                t = ct[i];
                ct[i] = ct[j];
                ct[j] = t;
            }
            if(ct[i].result == 0)
            {
                t = ct[i];
                ct[i] = ct[j];
                ct[j] = t;
            }
            if(ct[i].result == ct[j].result && strcmp(ct[i].name,ct[j].name) > 0)
            {
                t = ct[i];
                ct[i] = ct[j];
                ct[j] = t;
            }
        }
    }
    for(int i=0; i<n; i++)
    {
        printf("%d %s\n", ct[i].result, ct[i].name);
    }
	return 0;
}
```

### tips：

1.遇到个小警告，因为我在定义结构体的时候，下意识的初始化了，结构体初始化不能直接在定义的里面直接赋值初始化，不然会报错“非静态成员变量初始化仅限于....”
2.遇到这种输入多个数组值的，就应该想到用结构体
3.strcmp用于比较大小，1则左>右，0则相等，-1则是小于
4.if和elseif的区别在于，if是一定会判断执行的，而elseif则是前面的if失败了才执行

5.主要涉及到的知识点就是结构体定义，字符串输入，冒泡排序。
6.注意的细节就是，结构体定义末尾的}后面要加分号，字符串输入不用加取址符，还有就是“==”不要写成“=”了
7.这题的排序要把0排在后面以及按照字母大小排序，这需要注意。

# 作业六

## 72*

题目描述
设有n 个顾客同时等待一项服务。顾客i需要的服务时间为t i， 1<=i<=n 。应如何安排n个顾客的服务次序才能使平均等待时间达到最小?平均等待时间是n 个顾客等待服务时间以及服务时间的总和除以n。

对于给定的n个顾客需要的服务时间，编程计算最优服务次序。

```c
#include <stdio.h>
int main()
{
	int a[10000];
	int i, j, t;
	float averg;
	float s = 0;
	int n;
	scanf("%d", &n);
	for(i=0; i<n; i++)
	{
		scanf("%d", &a[i]);
	}
	for(i=0; i<(n-1); i++)
	{
		for(j=i+1; j<n; j++)
		{
			if(a[i] < a[j])
			{
				t = a[i];
				a[i] = a[j];
				a[j] = t;
			}
		}
	}
	for(i=0; i<n; i++)
	{
		s += a[i] * (i+1);
	}
	averg = s/n;
	printf("%.2f\n", averg);
	return 0;
}
```

### tips：

基本思想就是排序，然后计算时间，但是正序还是倒序呢？排队时应该时间少的在前面，但计算时间时，从大到小排显然更容易计算出答案，因此选择倒序。

## 509*

题目描述
东六—B104寝室四人经常记不住该谁扫地,他们是这样安排的:从2007年9月1号（星期六）起,每天按床号循环扫地，但是星期一除外,因为每个星期一都要检查卫生,他们决定星期一是大扫除。1号床：侯波（B），2号床：袁雄(X)，3号床：唐建华(H)，4号床：姚平(P)。9月1号就从1号床，侯波开始。请你编写一个程序帮他们解决寝室扫地问题。（不考虑节假日等其它因素）

```c
#include<bits/stdc++.h>

int Month[14]={0,31,28,31,30,31,30,31,31,30,31,30,31,0};//打表输入月份 
char name[][14]={"B","X","ALL","H","P","B","X","H","P","ALL","B","X","H","P"};//打表输入人 
int main()
{
    //输入年月日 
    int year,month,day,sum;
	scanf("%d %d %d",&year,&month,&day);
	//后缀和 
	for(int i=12;i>=1;i--){
		Month[i]+=Month[i+1];
	}
	//计算总天数
	sum=365*(year-2007)-Month[month]+Month[9]+day-1;
	if(sum>180) sum++;
	if(year==2008&&month==2&&day==29) sum=181;
    //输出
	printf("%s\n",name[sum%14]);
	return 0;
}
```

# 实验一

## 613

本题目非常简单，请编写一个程序实现以下功能： １、输出整型和字符型在内存中所占的字节数； ２、输入两个数字，输出其相对应的字符。

```c
#include <stdio.h>

int main()
{
    int num1, num2;
    scanf("%d %d", &num1, &num2);
    printf("%d %d\n", sizeof(int), sizeof(char));
    printf("%c %c\n", num1, num2);
    return 0;
}
```

## 614

请编写一个程序实现以下的题目要求： １、输入圆柱体的半径（radius）和高(high); 2、定义PI为3.14159; 3、求出圆柱体的体积。

```c
#include <stdio.h>  
#define	PI 3.14159

int main() {
	float radius = 0;
	float high =0;
	scanf("%f%f", &radius, &high);
	printf("radius:%.3f\n", radius);
    printf("high:%.3f\n",high);
	printf("The volume is:%.3f\n", PI * radius * radius * high);
	return 0;
}
```

# 实验二

## 77

编写一个程序，输入某雇员的每周工作时间（以小时计）和每小时的工资数，计算并输出他的工资。

如果时间小于0或大于一周的总时间，输出 input is wrong! ;

若雇员周工作小时超过40 小时，则超过部分按原工资的1.5 倍的加班工资来计算;

若雇员每周工作小时超过60 小时，则超过60 的部分按原工资的3 倍的加班工资来计算，而40 到60 小时的工资仍按照原工资的1.5 倍的加班工资来计算。

```c
#include<stdio.h>

int main()
{
	int time;
    float wages,money;
	scanf("%d%f",&time,&money);
	if(time < 0 || time > 168)
	{
		printf("input is wrong!\n");
	}
	else if(time > 0 && time < 40)
	{
		wages =time * money ;
		printf("%g\n",wages);
	}
	else if(time >= 40 && time < 60)
	{
		wages  =40*money+(time-40)*1.5*money ;
		printf("%g\n",wages);
	}
	else 
	{
		wages  =70*money+(time-60)*3*money ;
		printf("%g\n",wages);
	} 
	
	
    return 0;  
}
```

### tips：

%g是输出实数，根据数字的格式进行输出，不输出无意义的0

## 78*

编写一个程序，只要输入年月日，就能回答那天是星期几。

> 能被4整除但不能被100整除的，或者能被400整除的是闰年。
>
> 1、已知公元1年1月1日是星期一
> 2、算法：如果输入的是2006年7月10日，计算方法是
> （1）先计算从公元1年1月1日到2005年末（2005-12-31）共多少天，注意其中有闰年
> （2）然后再计算2006年1月1日到2006年7月10有多少天。
> 注意同样判断本年度是否闰年，即二月份是28天还是29天。
> （3）上述两部分相加计算得到的天数，用该天数与7求余，余数即为星期几。

```c
#include<stdio.h>
int main()
{
	int year,month,day,sum; 
	
	scanf("%d %d %d",&year,&month,&day);
	
	int a,b,c;
	
	a=year-1;
	
	b=365*a+a/4-a/100+a/400;//从开始到今年前一共的天数
	 
	switch(month) 
	{
		case 1:
			sum=day;
			break;
		case 2:
			sum=31+day;
			break;
		case 3:
			sum=31+28+day;
			break;
		case 4:
			sum=31+28+30+day;
			break;
		case 5:
			sum=31+28+30+31+day;
			break;	
		case 6:
			sum=31+28+30+31+30+day;
			break;	
		case 7:
			sum=31+28+30+31+30+31+day;
			break;
		case 8:
		    sum=31+28+30+31+30+31+31+day;
			break;
		case 9:
			sum=31+28+30+31+30+31+31+30+day;
			break;
		case 10:
			sum=31+28+30+31+30+31+31+30+31+day;
			break;
		case 11:
			sum=31+28+30+31+30+31+31+30+31+30+day;
			break;
		case 12:
			sum=31+28+30+31+30+31+31+30+31+30+31+day;//求今年的总天数 
			break;
	}
	if(month>2 &&(year%4== 0 && year%100!= 0)||(year%400==0))
	{
		sum=sum+1; //闰年加一天 
	}
     sum=sum+b;
     
	c=sum%7;
	
	switch(c)
	{
		case 0:
		printf("Sunday\n");
		break;
		case 1:
		printf("Monday\n");
		break;
		case 2:
		printf("Tuesday\n");
		break;
		case 3:
		printf("Wednesday\n");
		break;
		case 4:
		printf("Thursday\n");
		break;
		case 5:
		printf("Friday\n");
		break;
		case 6:
		printf("Saturday\n");
		break;
	}
	
	return 0; 
 } 
```

## 276

一个具有两个数加减乘除功能的计算器。

输入

```
输入有多组情况
表达式如 a+b，a，b为个位数
```

```c
#include<stdio.h>
int main()

{

    int a,b,m;

    char p;

    while(scanf("%d%c%d",&a,&p,&b)!=EOF){

    switch(p)

    {

    case '+':

        m=a+b;

        printf("%d%c%d%c%d\n",a,p,b,'=',m);

        break;

    case '-':

        m=a-b;

        printf("%d%c%d%c%d\n",a,p,b,'=',m);

        break;

    case '*':

        m=a*b;

        printf("%d%c%d%c%d\n",a,p,b,'=',m);

        break;

    case '/':

        m=a/b;

        printf("%d%c%d%c%d\n",a,p,b,'=',m);

        break;

    }

  }

    return 0;

}
```

### tips:

主要用到了switch(){case '':......; break;}

# 实验三

## 82

编写一个函数，求从n 个不同的数中取r 个数的所有选择的个数。

输入

```
输入n 和r 的值； 当用户输入0 0 时，程序结束。
```

输出

```
根据公式： C(n,r) = C(n, r-1) * (n - r + 1) / r 输出运算结果 输入数据不满足题意时候，输出"error!"
```

```c
#include <stdio.h>  
  
int com_num(int n,int r);  
  
int com_num(int n,int r) 
{  
	if(r>=1)
	{
		return com_num(n,r-1)*(n - r + 1) / r;
	}
	else
	{
		return 1; 
	}
}  
  
int main(void)  
{  
	int n,r;
	while(scanf("%d%d",&n,&r)!=EOF)
	{
		if(n==0 && r==0)
		{
			break;
		}
		else if(n<r)
		{
			printf("error!\n");
			
		}
		else
		{
			int ans = com_num(n,r);
			printf("%d\n",ans);			
		}

	}
	
    return 0;  
}
```

### 发现一个问题：*

```c
#include <stdio.h>

int num(int n,int r){
	if(r >=1 ) num(n,r-1)*(n-r+1)/r;
	else return 1;  	//这里写的也很细节，if的执行体是递归的内容，而else是退出函数，这样就算发送了意料之外的情况也可以避免程序崩溃，因为是直接返回1。但如果调换顺序就不一样了，发生意料之外的情况就会BBQ了。
}
int main(){
	int r=0,n=0;
	while(~scanf("%d%d",&n,&r)){
		if(n<r) printf("error!\n");
		else
		{
			printf("%d\n",num(n,r));
		}
		if(n==0 && r==0) break;
	}
	return 0;
}//这样写0 0之后确实也退出程序了，但会多打印一个1，原因在于if和else的关系上；这里写的是if...else...if...，就算n==r==0，也会执行else的语句，而这时会返回1。。。。
```



## 281*

装在瓶子(瓶子高度为h)的蠕虫都想从瓶子底部向瓶口处爬出去。它每分钟向上爬行u厘米，之后会休息一分钟，这一分钟它会向下滑行d厘米，当蠕虫到了瓶口或者超出瓶口后便出了瓶口，成功逃离（每分钟计算一次位置）。编写一个函数，帮助蠕虫计算它在什么时候能够爬出瓶子。

输入

```
连续输入多个的实例，每一个实例输入三个正整数分别代表h，u和d，其中d < h ，h < 60000，当输入三个0时表明输入停止。
```

```c
#include<stdio.h>
int f(int n,int u,int d)
{
    int i,m=0;//i就相当于是时间
    for(i=1;;i++)
    {
        m+=u;
        if(m>=n)//判断m>=n必写在这 可能在这一分钟虫刚好爬出了瓶口
            return i;
        i++;//休息的这一分钟
        m-=d;
    }
}
int main()
{
    int n,u,d;
    int f(int n,int u,int d);
    while(~scanf("%d%d%d",&n,&u,&d))
    {
        if(n==0&&u==0&&d==0)
            break;
        else
            printf("%d\n",f(n,u,d));
    }
    return 0;
}
```

## 299

用递归的方法求 f(n) = 1*1 + 2*2 + 3*3 +……+ n*n

```c
#include <stdio.h>  
  
int f(int n);  
  
int f(int n) 
{   
	if(n>=1)
	{
		int res1=n*n;
		return res1+f(n-1);//这题除了这里以外没什么特别的，就是设一个中间变量承载n*n，不然直接表达成f（n-1）*f（n-1）会出大问题。
	}
	else
	{
		return 0;//加法返回0，乘法返回1。
	}
}  
  
int main(void)  
{  
	int n;
	scanf("%d",&n);
	
	printf("%d\n",f(n));
	
	
    return 0;  
}
```

## 321

阶乘(factorial)是基斯顿·卡曼(Christian Kramp, 1760 – 1826)于1808年发明的运算符号。 任何大于1的自然数n阶乘可以表示为以下形式： n!=n×(n-1)! 另外，数学家定义，0！=1，所以0！=1！ 你的任务是编写一个程序来计算一个给定数字n的阶乘n!（n<14）

输入

```
输入数据只有一行，即数字n的值，（n<14)。
```

```c
#include <stdio.h>  
  
int fac(int n);  
  
int fac(int n)  
{  
    if(n>1 && n<=14)  
    {  
        return n*fac(n-1);   
    }  
    else if(n==1 || n==0)
    {  
        return 1; // 0和1的阶乘都定义为1  
    }  
}  
  
int main(void)  
{  
    int n;  
    scanf("%d",&n);  
    int ans =fac(n);   
    printf("%d\n",ans);  
    return 0;  
}
```

# 实验四

## 74

将两个给定的距阵(3*3)相乘得到另一个距阵并将其打印出来。

```c
#include<stdio.h>

int main()
{
	int a[3][3],b[3][3],c[3][3] ={0};
	for(int i=0;i<3;i++)
	{
		for(int j=0;j<3;j++)
		{
			scanf("%d",&a[i][j]);
		}
	}
	for(int i=0;i<3;i++)
	{
		for(int j=0;j<3;j++)
		{
			scanf("%d",&b[i][j]);
		}
	}	
	for(int i=0;i<3;i++)
	{
		for(int j=0;j<3;j++)
		{
			for(int k=0;k<3;k++)
			{
				c[i][k] +=a[i][j]*b[j][k];
			}
		}
	}
	for(int i=0; i<3; i++)
	{
		for(int j=0; j<3; j++)
		{
			printf("%d ", c[i][j]);
		}
		printf("\n");
	}
	return 0;
		
}
```

## 287

读入两个小于100的正整数A和B，计算A+B。需要注意的是：A和B的每一位数字由对应的英文单词给出。

```c
#include<stdio.h>
#include<string.h>
int num1(char a[])//num1和num2函数是一样的，构造两个函数主要是为了将输入的两个数字分清楚。目的将字符换为数字
{
    if(strcmp(a,"one")==0)
        return 1;
    else if(strcmp(a,"two")==0)
        return 2;
    else if(strcmp(a,"three")==0)
        return 3;
    else if(strcmp(a,"four")==0)
        return 4;
    else if(strcmp(a,"five")==0)
        return 5;
    else if(strcmp(a,"six")==0)
        return 6;
    else if(strcmp(a,"seven")==0)
        return 7;
    else if(strcmp(a,"eight")==0)
        return 8;
    else if(strcmp(a,"nine")==0)
        return 9;
    else if(strcmp(a,"zero")==0)
        return 0;
}
int num2(char a[])
{
    if(strcmp(a,"one")==0)
        return 1;
    else if(strcmp(a,"two")==0)
        return 2;
    else if(strcmp(a,"three")==0)
        return 3;
    else if(strcmp(a,"four")==0)
        return 4;
    else if(strcmp(a,"five")==0)
        return 5;
    else if(strcmp(a,"six")==0)
        return 6;
    else if(strcmp(a,"seven")==0)
        return 7;
    else if(strcmp(a,"eight")==0)
        return 8;
    else if(strcmp(a,"nine")==0)
        return 9;
    else if(strcmp(a,"zero")==0)
        return 0;
}
int main()//注意题的前提是两个小于100的数，意思就是两个两位数
{

    char a[20];//这里的a数组不止指代输入的字符串，还有“+”和“=”，“ ”等
    int num1(char a[]);
    int num2(char a[]);
    while(1)
    {
        int sum=0,sum1=0,sum2=0;
        scanf("%s",a);//这里a是第一个字符串
        sum1=num1(a);//将字符换为数字
        scanf("%s",a);//输入第二个字符串
        if(strcmp(a,"+")!=0)//判断第二个字符串是否是"+"，即判断第一个数字是否是两位数
        {
            sum1=sum1*10+num1(a);//不是加号则第一个数字是两位数
            scanf("%s",a);//这里a是“ ”
        }
        scanf("%s",a);
        sum2=num2(a);
        scanf("%s",a);
        if(strcmp(a,"=")!=0)
        {
            sum2=sum2*10+num2(a);
            scanf("%s",a);
        }
        sum=sum1+sum2;
        if(sum==0)
            return 0;//即sum1==0&&sum2==0
        else
            printf("%d\n",sum);
    }
    return 0;
}
```

## 288

给定一个只有小写英文字母组成的字符串，串长为n。请你编写程序求出这个字符串中出现次数最多的字母。

```c
#include<stdio.h>
#include <string.h>

int main()//注意题的前提是两个小于100的数，意思就是两个两位数
{
	int n= 0;
	scanf("%d",&n);
	int c1,c2,c3=0;
	char a[n] = "";
	int count[n] = {0};
	
	for (int i=0;i<n;i++)
	{
		scanf("%c",&a[i]);
	}
	for(int i=0;i<n;i++)
	{
		for(int j=0;j<n;j++)
		if(i!=j)
		{
			if(a[i]==a[j])
			{
				count[i]++;
			}
		}
	}
	int max = count[0];
	char m = a[0];
    for(int i = 1; i < n; i++) {  
        if(count[i] > max) {  
            max = count[i];
			m = a[i]; 
        }  
    } 
	printf("%c\n",m);
	return 0;
	
}
```

## 616

用选择法对N个学生的成绩按从大到小的顺序排序，N个学生的成绩整数用scanf 输入，输入的成绩在[0，100]之间。排序完成后，输入一个成绩，要求用逐个比较查找的方式找出该成绩是该组中第几个元素的值（即第几名）。如果该成绩不在数组中，则输出“no this score!”。 要求： 1、把排序算法写成函数形式，在主函数中输入N个数据，然后调用排序函数排序。 2、在排序过程中尽量减少数据的交换和移动。 3、把查找算法写成函数形式，在主函数中输入1个数据，然后调用查找函数查找。

```C
#include<stdio.h>
int main()
{
	int i,n,m,a[50];
	int f(int a[],int n);
	int g(int a[],int n,int m);
	while(scanf("%d",&n)!=EOF)
	{
		for(i=0;i<n;i++)
		{
			scanf("%d",&a[i]);
		}
		scanf("%d",&m);//输入选择你想找的数
		a[n]=f(a,n);
		g(a,n,m);
	}
	return 0;
}
int f(int a[],int n)//书上重点讲过的排序代码
{
	int i,j,t;
	for(i=0;i<(n-1);i++)
	{
		for(j=i+1;j<n;j++)
		{
			if(a[i]<a[j])
			{
				t=a[i];//应用变量t实现两个数之间的顺序改变
				a[i]=a[j];
				a[j]=t;
			}
		}
	}
	for(i=0;i<n;i++)
	{
		printf("%d",a[i]);
		if((i+1)%10==0 ||i==(n-1))
		printf("\n");
		else
		printf(" ");
	}
	return a[n];
}
int g(int a[],int n,int m)
{
	int i=0,j=0;
	while(i<n)//我试着用for循环，但是OJ不通过。但其实本身意义是相同的
	{
		if(m==a[i])
		{
			j++;
			break;
		}
		i++;
	}
	if(j!=0)
	printf("%d\n",i+1);
	else
	printf("no this score!\n");
	return 0;
}
```

tips：

主要的细节就是输出的换行和空格那些

# 实验五

## 617

一个班有N名学生，每个学生修了五门课。 1）求每个学生的平均成绩，并输出每个学生的学号，每门课程的成绩及平均值。 2）求某门课程的平均分； 1、分别编写2个函数实现以上2个要求。 2、第1个函数用数组名作参数。第2个函数用指针作参数，并在函数体内用指针对数组操作。

```C
#include <stdio.h>
#include <string.h>

int n=0;
float english[100]={0},math[100]={0},cplus[100]={0},music[100]={0},art[100]={0};

//单个学生的属性结构体，添加了平均分属性，方便后面函数的编写 
struct student{
	long int id;
	float english;
	float math;
	float cplus;
	float music;
	float art;
	float ave;
}; 
//单个学生的平均分 
void average(student stu[]){
	for(int i=0;i<n;i++){
	stu[i].ave = (stu[i].english+stu[i].math+stu[i].cplus+stu[i].music+stu[i].art)/5;
	}
}
//班级学科平均分 
void average_class(float *sub){ //使用了指针，相当于数组的用法 
	for(int i=0;i<n;i++){
		sub[0] += english[i];
		sub[1] += math[i];
		sub[2] += cplus[i];
		sub[3] += music[i];
		sub[4] += art[i];
	}
		sub[0]=sub[0]/n;
		sub[1]=sub[1]/n;
		sub[2]=sub[2]/n;
		sub[3]=sub[3]/n;
		sub[4]=sub[4]/n;
}


int main()
{
	scanf("%d",&n); //输入学生人数 
	student stu[100];
	float class_sub[5]={0};
//录入学生信息	
	for(int i=0;i<n;i++){
		scanf("%ld %f %f %f %f %f",&stu[i].id,&stu[i].english,&stu[i].math,&stu[i].cplus,&stu[i].music,&stu[i].art);
		//初始化全局变量，可以避免将结构体直接传参，增加运行效率 
		english[i]=stu[i].english;
		math[i]=stu[i].math;
		cplus[i]=stu[i].cplus;
		music[i]=stu[i].music;
		art[i]=stu[i].art;
	} 
	
//计算学生的平均分
 	average(stu);
//计算班级平均分
	average_class(class_sub); 
//打印信息
	for(int i=0;i<n;i++){
		printf("%ld %g %g %g %g %g %.1f\n",stu[i].id,stu[i].english,stu[i].math,stu[i].cplus,stu[i].music,stu[i].art,stu[i].ave);
	}
	printf("%.1f %.1f %.1f %.1f %.1f\n",class_sub[0],class_sub[1],class_sub[2],class_sub[3],class_sub[4]);
	return 0;
}
```

### tips：

1.细节一点，别打错字母然后无端报错了，其次在使用printf的时候别漏打占位符了，漏打了也不会报错，但结果会是Wrong Answer；
2.long int的占位符是%ld，但其实long int在具体使用时和int区别不大;（%.1f %f）
3.最开始写的时候，在传参方面出了点小错误，比如average(class_score[5]);不应该添“[5]”的，因为这样就代表一个元素了，但在定义函数时表示传进来的参数是数组可以写成"stu[]",括号内可以不写东西；
4.避免传递结构体参数可以定义几个全局变量，接受结构体参数，这样就直接使用全局变量就好了，不用传递结构体参数，而且更清晰(但要用到循环往全局变量传参，感觉也差不多？估计主要还是为了满足题目里面的需要用指针的要求吧)
5.这题“用指针对数组进行操作”的理解应该是，传入一个指向数组的指针，然后通过指针++访问数组每个元素，而不用复制整个数组进来，提高了效率

# 实验六

## 67

有N个学生，每个学生的数据包括学号、班级、姓名、三门课成绩。从键盘输入N 个
学生数据，要求打印出每个学生三门课的平均成绩，以及平均分最高分学生数据（包括学号、
班级、姓名、三门课成绩，平均分）。
要求：
1、 定义学生结构体。
2、 用一个函数实现N 个学生数据的输入，用另一个函数负责求每个学生三门课程的平
均成绩，再用一个函数求出平均分最高的学生并输出该学生的数据。要求平均分和平均分最
高的学生数据都在主函数中输出。

输入

```
第一行：N，表示N 个学生
下面N 行：每行数据包括学号、班级、姓名、三门课成绩。
```

```C
#include <string.h>   
#include <stdio.h>  


//学生结构体 
struct student{
	long int id;
	char cla[100];
	char name[100];
	float cla1,cla2,cla3,ave;
} ;
//输入函数 
void input(student stu[],int n){
	for(int i=0;i<n;i++){
		scanf("%ld %s %s %f %f %f",&stu[i].id,&stu[i].cla,&stu[i].name,&stu[i].cla1,&stu[i].cla2,&stu[i].cla3);
	}
}
//求平均成绩 
void ave(student stu[],int n){
	for(int i=0;i<n;i++){
		stu[i].ave = (stu[i].cla1+ stu[i].cla2+ stu[i].cla3)/3;
	} //用结构体或者数组就直接在函数里面进行操作，而不用需要函数返回什么值，也不用’&‘来传地址，因为它本身就指向地址。
}
//比较成绩 
int paixv(student stu[],int n){
	int index=0;
	for(int i=0;i<n;i++){
		
		if(stu[i].ave>stu[index].ave){
			index = i;
		}
	}
	return index;
}

  
int main() {  
	struct student stu[100];
	int n =0;
	scanf("%d",&n);
	input(stu,n);
	ave(stu,n);
	
	for(int i=0;i<n;i++){
		printf("%s %.1f\n",stu[i].name,stu[i].ave); 		
	}
	int l =paixv(stu,n);
	printf("%ld %s %s %.1f %.1f %.1f %.1f\n",stu[l].id,stu[l].cla,stu[l].name,stu[l].cla1,stu[l].cla2,stu[l].cla3,stu[l].ave);
	return 0;
}
```

### tips：

1.用scanf（）的时候不要把%f写成%.1f，区别极大！
2.输出的时候不要漏！！！不要漏啊啊啊。
3.函数中用到的数据一定都要定义形参！！！
4.题目要求平均分最高的学生的数据在主函数输出，所以排序函数只需要求出平均分最大的那个的下标就好了。

## 69

随着“开心农场”等娱乐游戏风靡互联网，“偷菜”遂瞬间蹿红网络，席卷网民生活。
于是，“你‘偷’了吗”便成为大家见面的招呼语。很快，数百万都市白领成为“偷菜”队
伍中的主力军，每天在“偷”与防“偷”中乐此不疲，甚至定闹钟半夜起床“偷”菜。根据
“农作物”生长规律而变化制定偷菜时间表。

输入

```
假设当前时间为13：15，第一行输入作物种类数n,
从第二行开始输入n 种作物成熟需要的时间，格式为
Hour：Minute。
```

```c
#include <string.h>   
#include <stdio.h>  

struct time{
	int hour,min;	
};
struct mut{
	int hour,min;	
};
  
int main() {  
	int now_hour =13;
	int now_min =15;
	int n;
	char a;
	struct time tim[100];
	struct time mut[100];
		
	scanf("%d",&n);
	for(int i=0;i<n;i++){
		scanf("%d%c%d",&tim[i].hour,&a,&tim[i].min);		
	}
	
	for(int i=0;i<n;i++){
		mut[i].min = (now_min + tim[i].min)%60;		
	}	
	for(int i=0;i<n;i++){
		mut[i].hour = (now_hour + tim[i].hour+ (now_min + tim[i].min)/60)%24;		
	}	
	for(int i=0;i<n;i++){
		printf("%d:%d\n",mut[i].hour,mut[i].min);	
	}	
	return 0;
}
```

### tips：

输入中有一个“：”不知道如何处理，参照别人的，只是简单的接收了，然后不管它。

遇事不决结构体+循环！

# 954: 单链表的链接

```c
#include<stdlib.h>
#include<stdio.h> 


//单链表A 
typedef struct LNode{
	struct LNode* next;
	char data;
}*Linklist,LNode; 

void initlist(Linklist &L){
	L = (LNode*)malloc(sizeof(LNode));
	L->next = NULL;
}



void initdata(Linklist &p,char char_input){
	LNode* new_node = (LNode*)malloc(sizeof(LNode));
	new_node->data = char_input; 
	new_node->next = NULL;
	p ->next = new_node; //p为尾结点 
	p = new_node;
	p->next =NULL;
}

int main(){
	int n = 0; //单链表A长度 
	scanf("%d",&n);
	Linklist L_A = NULL;
	initlist(L_A);
	LNode* p = L_A;
	char char_input;
	for(int i = 0;i<n;i++){
		scanf(" %c",&char_input); //前面加一个空格，用于忽略用户输入的换行符和空格等 
		initdata(p,char_input);
	}
	
	
	int m = 0; //单链表B长度 
	scanf("%d",&m);
	Linklist L_B = NULL;
	initlist(L_B);
	LNode* q = L_B;
	char int_input = 0;
	for(int i = 0;i<m;i++){
		scanf(" %c",&char_input);
		initdata(q,char_input);
	}
	//题目是要把B链接到A后面
	p->	next = L_B->next; //L_B是个头结点，所以跳过它 
	LNode* l = L_A;
	int len = m+n;
	for(int i = 0;i <len;i++){
		l = l->next;
		printf("%c ",l->data);
	}
	LNode* temp;  
	while (L_A->next != NULL) {  
	    temp = L_A->next;  
	    L_A->next = temp->next;  
	    free(temp);  
	}  
	free(L_A);
	free(L_B);
	
	
	return 0;
}
```





# 956: 约瑟夫问题的实现

以下代码超时了

```C
#include<stdlib.h>
#include<stdio.h> 


//单链表A 
typedef struct LNode{
	struct LNode* next;
	int data;
}*Linklist,LNode; 

void initlist(Linklist &L){
	L = (LNode*)malloc(sizeof(LNode));
	L->next = L;
	L->data = -1; //-1表示是头结点，不存数据 
}



void initdata(Linklist &p,int data,Linklist &L){
	LNode* new_node = (LNode*)malloc(sizeof(LNode));
	new_node->data = data; 
	new_node->next = NULL;
	p ->next = new_node; //p为尾结点 
	p = new_node;
	p->next = L;
}

int main(){
	int n = 0; //单链表A长度  人数 
	scanf("%d",&n);
	Linklist L = NULL;
	initlist(L);
	LNode* p = L;
	for(int i = 0;i<n;i++){
		initdata(p,i+1,L);  //给每个人编号
	}
	int k = 0; //每次数到k的人出圈  
	scanf("%d",&k);
	int count = 0; //已经淘汰的人数 
	p = L;
	while(count<n-1){
		for(int i = 0;i<k-1;i++){ //数到k-1，因为下一个是出圈的人 
			p = p->next;
			if(p == L){
				p = p->next;
			}
		} 	
        //p指向的是将要出去的人的前一个，这样删除结点的时候就不用再写一个遍历的去要删除结点的前一个结点了。
   		//但忘记考虑p的下一个结点如果是头结点的情况了，导致在释放内存的时候一直报错（因为误删头结点了）
			LNode* temp = p->next;
			if (temp ==L) temp = temp->next;
			p->next = temp->next;
			free(temp);
			count++;
	}
	int d = p->data;
	printf("%d",d);
	
	free(L);
	free(p); //只剩两个结点，直接free就好啦，不用写循环

	return 0;
}
```



# 953: 单链表的删除操作的实现

```c
#include<stdlib.h>
#include<stdio.h> 


//单链表A 
typedef struct LNode{
	struct LNode* next;
	int data;
}*Linklist,LNode; 

void initlist(Linklist &L){
	L = (LNode*)malloc(sizeof(LNode));
	L->next = NULL;
}

//void initdata(Linklist &p,int data){
//		LNode* new_node = (LNode*)malloc(sizeof(LNode));
//		new_node->data = data; 
//		new_node->next = NULL;
//		p ->next = new_node; //p为尾结点 
//		p = new_node;
//		p->next = NULL;
//}

bool deleteLNode(int data,Linklist &L,int n){
	LNode* pre = L;
	LNode* p = L->next;
	if(p->data == data) return false;
	for(int i = 0;i<n-1;i++){
		if(p->next->data == data){
			 
			pre->next = p->next;
			free(p);
			return true;
		}
		else{
			pre=p;
			p = p->next;
		}
	}
	return false;
}



int main(){
	int n = 0; //单链表长度
	scanf("%d",&n);
	Linklist L = NULL;
	initlist(L);
	LNode* p = L;
	int data = 0;
	for(int i =0;i<n;i++){
		scanf(" %d",&data);
		LNode* new_node = (LNode*)malloc(sizeof(LNode));
		new_node->data = data; 
		new_node->next = NULL;
		p ->next = new_node; //p为尾结点 
		p = new_node;
		p->next = NULL;
	}
	int data1 = 0;
	scanf("%d",&data1);
	if(deleteLNode(data1,L,n)){
		LNode* p = L;
		for(int i =0;i<n-1;i++){
			p = p->next;
			printf("%d ",p->data);
		}
	}
	else printf("error!");

	return 0;
}
```

# 957: 逆置单链表

```c
#include<stdlib.h>
#include<stdio.h> 


//单链表A 
typedef struct LNode{
	struct LNode* next;
	char data;
}*Linklist,LNode; 

void initlist(Linklist &L){
	L = (LNode*)malloc(sizeof(LNode));
	L->next = NULL;
}
//头插法 
void reverse(Linklist &L){
	LNode* p = L->next;
	L->next = NULL;
	LNode* q = NULL;
	while(p){
		q = p;
		p = p->next;//写的时候这句代码位置放错了，一直运行不了
		q->next = L->next;
		L->next = q;
		
	}
}



int main(){
	int n = 0; //单链表长度
	scanf("%d",&n);
	Linklist L = NULL;
	initlist(L);
	LNode* p = L;
	char data = 0;
	for(int i =0;i<n;i++){
		scanf(" %c",&data);
		LNode* new_node = (LNode*)malloc(sizeof(LNode));
		new_node->data = data; 
		new_node->next = NULL;
		p ->next = new_node; //p为尾结点 
		p = new_node;
		p->next = NULL;
	}
	reverse(L);
	p = L->next;
	for(int i =0;i<n;i++){
		printf("%c ",p->data);
		 p = p->next;
	}
	
	LNode* temp;  
	while (L->next != NULL) {  
	    temp = L->next;  
	    L->next = temp->next;  
	    free(temp);  
	}  
	free(L);
	
	return 0;
}
```

# 1103: 删除顺序表中指定区间的数据

```c
#include<stdlib.h>
#include<stdio.h> 

struct Seqlist{
	int* data;
	int Maxsize; 
	int length; //当前长度 
};

void initlist(struct Seqlist &L,int n){
	L.data = (int*)malloc(sizeof(int)*n); 
	L.Maxsize = n;
	L.length = 0;
	for(int i = 0;i<L.Maxsize;i++){
		L.data[i] = 0;
	}
	//可以设置data数组的值，也可以不设置，因为合法的访问一般不会访问到length外的值，而此时length = 0 
}

void deletedata(int i,Seqlist &L,int len){
	int* temp = L.data;	
	L.data = (int*)malloc(sizeof(int)*(len-1));
	int k = 0;
	for(int j = 0;j<len-1;j++){
		
		if(k==i) k++;
		L.data[j] = temp[k];
		k++;
	}
	L.length--;
	L.Maxsize = len-1;
	free(temp);
	
} 


int main(){
	struct Seqlist L;
	int n = 0; //顺序表长度 
	scanf("%d",&n);
	initlist(L,n);
	int input_data;
	for(int i =0;i<n;i++){
		scanf("%d",&input_data);
		L.data[i] = input_data;
		L.length++;
	} //录入数据到顺序表 
	
	int l,r;
	scanf(" %d %d",&l,&r);
	for(int i =0;i<n;i++){
		if(L.data[i]>=l && L.data[i]<=r){
			deletedata(i,L,L.length);
			i--;
			n--;
		}
	}
	
	for(int i =0;i<L.length;i++){
		printf("%d ",L.data[i]);
	}
	return 0;
}
```

# 1231: 寻找出现次数最多的数（copy的）

```c
#include<stdio.h>
#include<stdlib.h>

typedef struct LNode
{
	int data, sum;
	struct LNode *next;
}LinkNode;

void Creat(LinkNode *&L, int n)
{
	/*创建长度为n的单链表*/ 
	L = (LinkNode *) malloc (sizeof(LinkNode));
	LinkNode *p, *q;
	q = L;
	for(int i=0; i<n; i++)
	{
		p = (LinkNode *) malloc (sizeof(LinkNode));
		scanf("%d", &p->data);
		q->next = p;
		q = p;
	}
	q->next = NULL;
}

void merge(LinkNode *&L)
{
	/*删除L->data相同节点，并计数在L->sum中*/ 
	LinkNode *p, *q, *r;
	p = L->next;
	while(p != NULL)
	{
		q = p;
		p->sum = 1;
		while(q->next != NULL)
		{
			if(p->data == q->next->data)
			{
				p->sum++;
				r = q->next;
				q->next = r->next;
				free(r);
			}
			else	q = q->next;
		}
		p = p->next;
	}
}

void ComNode(LinkNode *L)
{
	/*比较L->sum是否相同，如果相同则输出最小的L->data*/
	LinkNode *p, *q, *r;
	p = L->next;
	r = L->next;
	int maxsum = p->sum;
	int min;
	while( r != NULL)
	{
		if(maxsum < r->sum)
		{
			maxsum = r->sum;
		}
		min = r->data;
		r = r->next;
	}
	while( p != NULL)
	{
		if(p->sum == maxsum && p->data < min)
			min = p->data;
		p = p->next;
	}
	printf("%d", min);
}

int main()
{
	int n;
	LinkNode *L, *p;
	scanf("%d", &n);
	Creat(L, n);
	merge(L);
	ComNode(L);
	return 0;
}




```

# 960: 双向链表的操作问题

```C
#include<stdio.h>
#include<stdlib.h>

typedef struct DNode{
	DNode* prior;
	DNode* next;
	int data;
	
}*DLinkList,DNode;


void CreatList(DLinkList &L,int n){
	//先初始化头指针
	L = (DLinkList)malloc(sizeof(DNode));
	L->next = NULL;
	L->prior = NULL;
	L->data = 0; //头结点不含数据，这里设置为0； 
	
	DNode* p = L; //用于过渡，实现尾插法 
	for(int i = 0;i<n;i++){
		DNode* temp = (DNode*)malloc(sizeof(DNode));
		scanf(" %d",&temp->data);
		temp->next = NULL;
		p->next = temp;
		temp->prior = p;
		p = p->next; 
	}
}


void sor(DLinkList &L,int n){
	DNode* p = L->next;
	int temp = 0;
	while(n>0){
		for(int i = 0;i<n-1;i++){
			if(p->data>p->next->data){
				temp = p->next->data;
				p->next->data = p->data;
				p->data = temp;
				
			}
			p = p->next; 
		}
		p = L->next;
		n--;
	}
} 

void printfLinkList(DLinkList &L,int n){
	DNode* p =L->next;
	for(int i =0;i<n;i++){
		printf("%d ",p->data);
		p = p->next;
	}
	
}


int main(){
	int n = 0;
	scanf(" %d",&n);
	DLinkList L = NULL;
	CreatList(L,n);
	sor(L,n);
	printfLinkList(L,n);
	
	
	return 0;
} 
```

# 962: 括号匹配问题(copy)

```c
#include<stdio.h>
char stack[300],ori[300];//用一个stack数组做栈，用一个ori数组存储所有括号
int main()
{
 	int top=0,i=0;
 	scanf("%s",ori);
 	while(ori[i]!='\0')//ori数组没有到最后
 	{
  		if(ori[i]=='('||ori[i]=='[')//压栈
  		{
   			top++;
   			stack[top]=ori[i];
  		}
  		//以下是pop部分
  		else if(ori[i]==']'&&stack[top]=='[')
  			top--;
  		else if(ori[i]==')'&&stack[top]=='(')
   			top--;
  		else//是为了应对这种类型的情况：()))))) 
  		{
   			printf("NO");
   			return 0;
  		}
  		i++;
 	}
 	if(top)//最后top=0的时候表示可以匹配，输出YES，否则输出NO
  		printf("NO");
 	else
  		printf("YES");
  	return 0;
}
```

自己写的（  应付不了数据：“[(])”的情况 ）

```C
#include<stdlib.h>
#include<stdio.h>
#include<math.h>

typedef struct{
	char data[50];
	int top;
}SqStack; 

void Push(SqStack &S,char x){
	S.top++;
	S.data[S.top] = x;
}

void CreatStack(SqStack &S){
	S.top = -1;
	char a[50] = {0};
	scanf("%s",a);
	for(int i =0;i<50;i++){
		if(a[i]==0) break;
		else{
			Push(S,a[i]);
		}
	}
	
} 

void Pop(SqStack &S,char &x){
	x = S.data[S.top];
	S.top--;
} 

bool bracketCheck(SqStack &S){
	char x;
	char x1;
	int p = 0;
	int q = 0;
	int n = S.top+1;
	for(int i =0;i<n;i++){
		Pop(S,x);
		if(x == ')') p++;
		else if(x == ']') q++;
		else if(x == '(') p--;
		else if(x == '[') q--;
		
		if(p<0 ||q<0) return false;
	}
	if(p==0 && q==0) return true;
	else return false;
} 

int main(){
	SqStack S;
	CreatStack(S);
	if(bracketCheck(S)) printf("YES");
	else printf("NO");
	return 0;
}
	

```

# 1028: 特定字符序列的判断

```C
#include<stdlib.h>
#include<stdio.h>
#include<math.h>


char a[100];


typedef struct{
	char data[50];
	int top;
}SqStack; 



void Push(SqStack &S,char x){
	S.top++;
	S.data[S.top] = x;
}

void InitStack(SqStack &S){
	S.top = -1;
} 


void Pop(SqStack &S,char &x){
	x = S.data[S.top];
	S.top--;
} 

bool Jup(SqStack &S){
	scanf(" %s",a);
	int i =0;
	while(a[i]!='\0'){
		if(a[i]=='@') break;
		else{
			Push(S,a[i]);
		}
		i++;
	}
	i++;
	while(a[i]!='#'){
		char x = 0;
		Pop(S,x);
		if(a[i] != x) return false;
		i++;
	}
	return true;
	
}

int main(){
	SqStack S;
	InitStack(S);
	if(Jup(S)) printf("yes!");
	else printf("no!");
	return 0;
}
```

# 

```c

```



# 971: 统计利用先序遍历创建的二叉树的深度

```c
#include<stdio.h>
#include<stdlib.h>
#include<math.h>

typedef struct BiTNode{
	char data;
	BiTNode* lchild;
	BiTNode* rchild;	
}*BiTree,BiTNode; 

void pre_cre(BiTree &T){
	char x = 0;
	scanf(" %c",&x);
	if(x!='#'){
		T = (BiTree)malloc(sizeof(BiTNode));
		T->data = x;
		pre_cre(T->lchild);		
		pre_cre(T->rchild);	
	}
	else T = NULL;
}

void pre_show(BiTree &T){
	if(T==NULL) return;
	printf("%c ",T->data);
	pre_show(T->lchild);
	pre_show(T->rchild);
}

void mid_show(BiTree &T){
	if(T==NULL) return;
	mid_show(T->lchild);
	printf("%c ",T->data);
	mid_show(T->rchild);
}

int maxDepth(BiTree &root) {
    if(root == NULL) return 0;
    else return fmax(maxDepth(root->lchild),maxDepth(root->rchild)) +1;
}


int main(){
	BiTree T;
	pre_cre(T);
//	mid_show(T);
	int depth = maxDepth(T);
	printf("%d",depth);
	
	return 0;
}
```



# 972: 统计利用先序遍历创建的二叉树的宽度

```c
#include<stdio.h>
#include<stdlib.h>

typedef struct BiTNode{
	char data;
	BiTNode* lchild;
	BiTNode* rchild;
}*BiTree,BiTNode; 

void pre_cre(BiTree &T){
	T = (BiTree)malloc(sizeof(BiTNode));
	char x = 0;
	scanf(" %c",&x);
	if(x!='#'){
		T->data = x;
		pre_cre(T->lchild);
		pre_cre(T->rchild);
	}
	else T = NULL;
	
}

void Width(BiTree& t,int k,int* width,int& max){
	if(t!=NULL){
		width[k]++;
		max = max<width[k] ? width[k]:max;
		Width(t->lchild,k+1,width,max);
		Width(t->rchild,k+1,width,max);
	}	
}

int main(){
	BiTree T;
	pre_cre(T);
	int max = 0;
	int width[50] ={0};
	
	Width(T,1,width,max);
	printf("%d",max);
	
	return 0;
}
```

# 973: 统计利用先序遍历创建的二叉树叶结点的个数

```C
#include<stdio.h>
#include<stdlib.h>

typedef struct BiTNode{
	char data;
	BiTNode* lchild;
	BiTNode* rchild;	
}*BiTree,BiTNode; 

void pre_cre(BiTree &T){
	char x = 0;
	scanf(" %c",&x);
	if(x!='#'){
		T = (BiTree)malloc(sizeof(BiTNode));
		T->data = x;
		pre_cre(T->lchild);		
		pre_cre(T->rchild);	
	}
	else T = NULL;
}

void node_count(BiTree &T,int& node){
	if(T==NULL) return;
	if(T->lchild==NULL and T->rchild==NULL) {
		node++;
		return;	
	}
	node_count(T->lchild,node);
	node_count(T->rchild,node);
}


int main(){
	BiTree T;
	pre_cre(T);
	if(T==NULL) {
		printf("0");
		return 0;
	}
	int node = 0;
	node_count(T,node);
	printf("%d",node);
	return 0;
}
```





# 975: 统计利用先序遍历创建的二叉树的度为2的结点个数

```C
#include<stdio.h>
#include<stdlib.h>

typedef struct BiTNode{
	char data;
	BiTNode* lchild;
	BiTNode* rchild;	
}*BiTree,BiTNode; 

void pre_cre(BiTree &T){
	char x = 0;
	scanf(" %c",&x);
	if(x!='#'){
		T = (BiTree)malloc(sizeof(BiTNode));
		T->data = x;
		pre_cre(T->lchild);		
		pre_cre(T->rchild);	
	}
	else T = NULL;
}

void node_count(BiTree &T,int& node){
	if(T==NULL) return;
	if(T->lchild!=NULL and T->rchild!=NULL) {
		node++;
	} //跟973就这里不一样而已，去掉了return，把等于改成不等于
	node_count(T->lchild,node);
	node_count(T->rchild,node);
}


int main(){
	BiTree T;
	pre_cre(T);
	if(T==NULL) {
		printf("0");
		return 0;
	}
	int node = 0;
	node_count(T,node);
	printf("%d",node);
	return 0;
}
```

# 978: 输出利用先序遍历创建的二叉树的中序遍历序列

```c
#include<stdio.h>
#include<stdlib.h>
#include<math.h>

typedef struct BiTNode{
	char data;
	BiTNode* lchild;
	BiTNode* rchild;	
}*BiTree,BiTNode; 

void pre_cre(BiTree &T){
	char x = 0;
	scanf(" %c",&x);
	if(x!='#'){
		T = (BiTree)malloc(sizeof(BiTNode));
		T->data = x;
		pre_cre(T->lchild);		
		pre_cre(T->rchild);	
	}
	else T = NULL;
}

void pre_show(BiTree &T){
	if(T==NULL) return;
	printf("%c ",T->data);
	pre_show(T->lchild);
	pre_show(T->rchild);
}

void mid_show(BiTree &T){
	if(T==NULL) return;
	mid_show(T->lchild);
	printf("%c",T->data);
	mid_show(T->rchild);
}

int maxDepth(BiTree &root) {
    if(root == NULL) return 0;
    else return fmax(maxDepth(root->lchild),maxDepth(root->rchild)) +1;
}


int main(){
	BiTree T;
	pre_cre(T);
	mid_show(T);
	
	return 0;
}
```



# 1101: 顺序表中数据的循环移动

```c
#include<stdio.h>
#include<stdlib.h>
#define MAXSIZE 100


struct SqList{
	int data[MAXSIZE];
	int length;
};


void CreatList(SqList &L,int n){
	L.length = n;
	
	for(int i=0;i<n;i++){
		scanf(" %d",&L.data[i]);
	}	
}

bool MovList(SqList &L,int p){
	int len = L.length;
	if(p>len-1 or p<=0) return false;
	int temp[len] = {0};
	for(int i = 0;i<len;i++){
		temp[i] = L.data[(i+p + len)%len];
	}
	for(int i = 0;i<len;i++){
		L.data[i] = temp[i];
	}
	return true;
	
}


int main(){
	SqList L;
	int n = 0;
	scanf("%d",&n);
	int p = 0;
	CreatList(L,n);
	scanf("%d",&p);
	if(MovList(L,p)){	
	for(int i = 0;i<L.length;i++){
		printf("%d ",L.data[i]);
	}
}
	else printf("error!");

	return 0;
} 
```



# 1042: 中缀表达式转换为后缀表达式

```c
#include<stdio.h>
#include<stdlib.h>

typedef struct SqStack{
	char data[100];
	int top;
}SqStack;

void Push(SqStack &s,char x){
	s.top++;
	s.data[s.top] = x;
}

void Pop(SqStack &s,char &x){
	x = s.data[s.top];
	s.top--;
}

//void cre_sta(SqStack &s,int n){
//	s.top = -1;
//	int x = 0;
//	for(int i = 0;i<n;i++){
//		scanf(" %d",&x);
//		Push(s,x);
//	}
//}

void initSta(SqStack &s){
	s.top = -1;
}


int main(){
	char c[50];
	char ans[50] ={0}; 
	SqStack s;
	initSta(s);
	scanf("%s",c);
	int i = 0;
	int j = 0;
	int left = 0;
	while(c[i]!='\0'){
		if(c[i]>='A' && c[i]<='Z'|| c[i]>='a' && c[i]<='z' ) {
			ans[j++] = c[i];
		}
		else if(c[i]=='(') {
			Push(s,c[i]); //遇到左括号直接入栈
			left = s.top;
	}
		else if(c[i]==')'){
			while(s.data[s.top]!='('){
				Pop(s,ans[j++]);
			}
			s.top--;
		}
		else{ //运算符优先级大于等于现在这个元素的出栈 
			while(true){
				if(c[i]=='+' || c[i] == '-'){
					if(s.data[s.top] == '(' || s.top == -1) {
						
						Push(s,c[i]);
						break;	
					}
					else {
						Pop(s,ans[j++]);
					}
			} 
				else if(c[i]=='/' || c[i] == '*'){
					if(s.data[s.top] == '*' || s.data[s.top]=='/') {
						Pop(s,ans[j++]);
					}
					else{
						Push(s,c[i]);	
						break;
					}
				}
				}			
		}
		i++;
	}
	Pop(s,ans[j++]);
		while(left>0){
		Pop(s,ans[j++]);
		left--;
	}
	
	for(int k =0;k<j;k++){
		printf("%c",ans[k]);
	}
	
	
	
	return 0;
}
 
```







# 标记















