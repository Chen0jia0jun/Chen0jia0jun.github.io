---
title: "C++_STL学习"
createdAt: "2024-05-26T10:30:00"
updatedAt: "2025-12-11T14:20:00"
---

# 一、STL概述

### 1.STL基本概念

STL(`Standard Template Library`,标准模板库)，从广义上分为: `容器(container) 算法(algorithm) 迭代器`(iterator),容器和算法之间通过[迭代器](https://so.csdn.net/so/search?q=迭代器&spm=1001.2101.3001.7020)进行无缝连接。

## 2.STL六大组件简介

STL提供了六大组件，彼此之间可以组合套用，这六大组件分别是:容器、算法、迭代器、仿函数、适配器（配接器）、空间配置器。
容器：各种数据结构，如vector、list、deque、set、map等,用来存放数据，从实现角度来看，STL容器是一种class template。
算法：各种常用的算法，如sort、find、copy、for_each。从实现的角度来看，STL算法是一种function tempalte.
迭代器：扮演了容器与算法之间的胶合剂，共有五种类型，从实现角度来看，迭代器是一种将operator* , operator-> ,operator++,operator--等指针相关操作予以重载的class template.所有STL容器都附带有自己专属的迭代器，只有容器的设计者才知道如何遍历自己的元素。原生指针(native pointer)也是一种迭代器。
仿函数：行为类似函数，可作为算法的某种策略。从实现角度来看，仿函数是一种重载了operator()的class 或者class template
适配器：一种用来修饰容器或者仿函数或迭代器接口的东西。
空间配置器：负责空间的配置与管理。从实现角度看，配置器是一个实现了动态空间配置、空间管理、空间释放的class tempalte.



# String(字符串)

```
#include<string>

/*string 生成*/
string str("123"); //"123"
string str(3,"1"); //"111"
string str = "123"; //"123"

/*string 头尾*/
str.front(); //第一个元素 
str.back(); //最后一个元素 

/*string 迭代器*/
string::iterator iter //一个string的迭代器
str.begin() //指向str第一个元素位置的迭代器 
str.end() //指向str最后一个元素后一个位置的迭代器 

/*string 插入*/
str.push_back('a'); //在尾部插入一个字符
str.insert(s1.begin(), 'a'); //在指定位置前面插入一个字符

/*string 删除*/
str.pop_back(); //删除最后一个元素 
str.erase(str.begin()); //删除迭代器指向元素
str.erase(str.begin()+1, str.end()-2); //删除指定区间的元素
str.erase(1, 6); //删除从索引（1）开始的n（6）个字符

/*string 替换*/
str.replace(str.begin(), str.begin + 5, "boy"); //替换迭代器指定的区间
str.replace(6, 5, "girl"); //替换索引指定的区间，从下标6开始的五个元素 

/*string 拼接*/
str1.append(str2); //str1str2
str1 = str1 + str2; //str1str2

/*string 容量*/
str.size()
str.length()

/*string 遍历*/
for(int i = 0; i < str.size(); i ++ ) //索引遍历 
for(string::iterator iter = str.begin(); iter != str.end(); iter ++ ) //迭代器遍历 
for(auto &x : str) //迭代器另一种便捷方法 

/*string 排序*/
sort(str.begin(), str.end());

/*string 比较*/
str1 < str2 //字典序比较，<、<=、==、>、>=都可以用
str1.compare(str2) //相等为0，str1>str2为1，反之-1

/*sting 查找*/
str.find("123") //从前往后找，若找到，返回首字母下标；反之，返回-1
str.rfind("123") //从后往前找
str.find_first_of("123") //查找第一个属于该字符串的字符返回下标
str.find_first_not_of("123")
str.find_last_of("123")
str.find_last_not_of("123")

/*string 某元素个数*/
str.count('a'); //返回str里a字符的个数 

/*string 分割*/
str.substr(2, 5); //返回从索引2开始的五个元素组成的字符串 

/*string 判空*/
str.empty() //返回布尔值 

/*string 清空*/
str.clear();

```



# Vector（容器）

```
#include <vector>

/*vector 生成*/
vector<int> vct(3); //0 0 0
vector<int> vct(3, 5); //5 5 5
vector<int> vct{1, 2, 3}; //1 2 3

/*vector 头尾*/
vct.front(); //第一个元素 
vct.back(); //最后一个元素 

/*vector 迭代器*/
vector<int>::iterator iter //一个vector的迭代器
vct.begin() //指向vct第一个元素位置的迭代器 
vct.end() //指向vct最后一个元素后一个位置的迭代器

/*vector 插入*/
vct.push_back(2); //在尾部插入一个2
vct.insert(vct.begin(), 2); //在指定位置前面插入一个元素

/*vector 删除*/
vct.pop_back();
vct.erase(vct.begin());
vct.erase(vct.begin()+1, vct.end()-2);
vct.erase(1, 6);

/*vector 容量*/
vct.size()

/*vector 遍历*/
for(int i = 0; i < vct.size(); i ++ ) //索引遍历 
for(vector<int>::iterator iter = vct.begin(); iter != vct.end(); iter ++ ) //迭代器遍历 
for(auto &x : vct) //迭代器另一种便捷方法 

/*vector 排序*/
sort(vct.begin(), vct.end());

/*vctor 查找*/
vct.find(2) //从前往后找，若找到，返回指向该处的迭代器；反之，返回迭代器vct.end()

/*vctor 某元素个数*/
vct.count(2); //返回容器里2的个数 

/*vector 判空*/
vct.empty() //返回布尔值 

/*vector 清空*/
vct.clear();

```



# list（列表）



- **双向迭代**：`<list>` 提供了双向迭代器，可以向前和向后遍历元素。
- **动态大小**：与数组不同，`<list>` 的大小可以动态变化，不需要预先分配固定大小的内存。
- **快速插入和删除**：可以在列表的任何位置快速插入或删除元素，而不需要像向量那样移动大量元素。

```
声明列表：std::list<T> mylist;，其中 T 是存储在列表中的元素类型。

/*list 迭代器*/
遍历使用迭代器 for (auto it = mylist.begin(); it != mylist.end(); ++it)
begin()	返回第一个元素的迭代器
end()	返回最后一个元素下一个位置的迭代器
rbegin()	返回最后一个元素的迭代器
rend()	返回第一个元素的前一个位置额迭代器

/*list 容量*/
size	//返回容器中有效元素个数
resize	//调整容器的有效元素大小(size)
empty	//判断容器是否为空
clear	//用于清空容器,清空后容器的size为0, 但是头结点(哨兵位)不会被清除

/*list 访问*/
mylist.front();
mylist.back();

/*list 修改*/
pop_back(value);
pop_front(value);
push_back(value);
push_front(value);
remove(value);
erase(iterator);
swap(list);

/*list 基操*/
unique();    //删除连续的重复元素 
sort()       //对元素进行排序，默认升序
list1.merge(list2); // 将 list2 合并到 list1 中；但首先都要进行一次排序
 reverse()   //将该链表的所有元素的顺序反转
```



# heap(堆)

- make_heap( )：建立堆（要么大顶堆，要么小顶堆）
- push_heap( ): 在堆中添加元素
- pop_heap( ): 在堆中删除元素
- sort_heap( ): 堆排序

```c
#include<bits/stdc++.h>

#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

void printHeap(vector<int> &v){
    for(vector<int>::iterator it= v.begin();it!=v.end();++it){
        cout<< *it <<" ";
    }
    cout<<"\n"<<endl;
}

int main()
{
    vector<int> min={10,30,22,6,15,9};

    //建立小顶堆
    make_heap(min.begin(), min.end(), greater<int>());
    printHeap(min);//6 10 9 30 15 22

    //插入元素
    min.push_back(20);
    push_heap(min.begin(),min.end(), greater<int>());//该算法前提：必须在堆的条件下
    printHeap(min); //6 10 9 30 15 22 20   仍为小顶堆

    //删除堆顶元素
    pop_heap(min.begin(),min.end(), greater<int>());
    printHeap(min);//9 10 20 30 15 22 6  不为小顶堆 这个pop_heap操作后，实际上是把堆顶元素放到了末尾
    min.pop_back();//这才彻底在底层vector数据容器中删除
    printHeap(min);//9 10 20 30 15 22  仍为小顶堆

    //堆排序  保持greater，小顶堆，得到的是降序
    sort_heap(min.begin(),min.end(), greater<int>());//试了用less，结果杂乱无章
    printHeap(min);//30 22 20 15 10 9 注意结果是降序的哦!!!其实是调用了很多次pop_heap(...,greater..)，每一次都把小顶堆堆顶的元素往末尾放，没放一次end迭代器减1

    return 0;
}

```

# set(集合)

```
s.begin()					//返回指向第一个元素的迭代器
s.end()						//返回指向最后一个元素的迭代器
s.clear()					//清除所有元素
s.count()					//返回某个值元素的个数
s.empty()					//如果集合为空，返回true，否则返回false
s.equal_range()				//返回集合中与给定值相等的上下限的两个迭代器
s.erase()					//删除集合中的元素
s.find(k)					//返回一个指向被查找到元素的迭代器
s.insert()					//在集合中插入元素
s.lower_bound(k)			//返回一个迭代器，指向键值大于等于k的第一个元素
s.upper_bound(k)			//返回一个迭代器，指向键值大于k的第一个元素
s.max_size()				//返回集合能容纳的元素的最大限值
s.rbegin()					//返回指向集合中最后一个元素的反向迭代器
s.rend()					//返回指向集合中第一个元素的反向迭代器
s.size()					//集合中元素的数目

lower_bound(key_value) ：返回第一个大于等于key_value的定位器
upper_bound(key_value)：返回第一个大于key_value的定位器

for(auto it = v.begin();it!=v.end();it++) int id = *it;

```





# deque(双端队列容器)

```
/*deque 生成*/
std::deque<int> d;
std::deque<int> d(3); //0 0 0 
std::deque<int> d(3, 5) //5 5 5 


begin()	返回指向容器中第一个元素的迭代器。
end()	返回指向容器最后一个元素所在位置后一个位置的迭代器，通常和 begin() 结合使用。
rbegin()	返回指向最后一个元素的迭代器。
rend()	返回指向第一个元素所在位置前一个位置的迭代器。
cbegin()	和 begin() 功能相同，只不过在其基础上，增加了 const 属性，不能用于修改元素。
cend()	和 end() 功能相同，只不过在其基础上，增加了 const 属性，不能用于修改元素。
crbegin()	和 rbegin() 功能相同，只不过在其基础上，增加了 const 属性，不能用于修改元素。
crend()	和 rend() 功能相同，只不过在其基础上，增加了 const 属性，不能用于修改元素。
size()	返回实际元素个数。
max_size()	返回容器所能容纳元素个数的最大值。这通常是一个很大的值，一般是 232-1，我们很少会用到这个函数。
resize()	改变实际元素的个数。
empty()	判断容器中是否有元素，若无元素，则返回 true；反之，返回 false。
shrink _to_fit()	将内存减少到等于当前元素实际所使用的大小。
at()	使用经过边界检查的索引访问元素。
front()	返回第一个元素的引用。
back()	返回最后一个元素的引用。
assign()	用新元素替换原有内容。
push_back()	在序列的尾部添加一个元素。
push_front()	在序列的头部添加一个元素。
pop_back()	移除容器尾部的元素。
pop_front()	移除容器头部的元素。
insert()	在指定的位置插入一个或多个元素。
erase()	移除一个元素或一段元素。
clear()	移出所有的元素，容器大小变为 0。
swap()	交换两个容器的所有元素。
emplace()	在指定的位置直接生成一个元素。
emplace_front()	在容器头部生成一个元素。和 push_front() 的区别是，该函数直接在容器头部构造元素，省去了复制移动元素的过程。
emplace_back()	在容器尾部生成一个元素。和 push_back() 的区别是，该函数直接在容器尾部构造元素，省去了复制移动元素的过程。

```



# stack（栈）

```
stack<int> q;	//以int型为例
int x;
q.push(x);		//将x压入栈顶
q.top();		//返回栈顶的元素
q.pop();		//删除栈顶的元素
q.size();		//返回栈中元素的个数
q.empty();		//检查栈是否为空,若为空返回true,否则返回false
```



# map

map是一个关联容器，它存储的元素都是**键值对**（key-value pair），并且**根据键（key）自动排序的容器**。map不允许键重复，每个键在map中只能出现一次。map容器的每一个元素都是一个**pair**结构（`pair<t1,t2>`）的数据。



```
/*map 生成*/
std::map<int, std::string> myMap; // 创建一个空的map，键类型为int，值类型为std::string
std::map<int, std::string> myMap1 = { {1, "one"}, {2, "two"} };  
std::map<int, std::string> myMap2(myMap1); // myMap2现在包含myMap1的所有元素


/*map 赋值*/
std::map<int, std::string> myMap1 = { {1, "one"}, {2, "two"} };  
std::map<int, std::string> myMap2 = { {3, "three"}, {4, "four"} };  
myMap2 = myMap1; // 使用重载的等号操作符将myMap1的内容赋值给myMap2
myMap1.swap(myMap2); // 交换myMap1和myMap2的内容

/*map 容量*/
map.size(); //返回元素数
map.empty(); //返回bool值

/*map 增改*/
std::map<int, std::string> mapStu;  
// 第一种 通过pair的方式插入对象  
mapStu.insert(std::pair<int, std::string>(3, "小张"));  
  
// 第二种 通过make_pair的方式插入对象（注意：您的示例中写成了inset，这是错误的，应该是insert）  
mapStu.insert(std::make_pair(-1, "校长"));  
  
// 第三种 通过value_type的方式插入对象  
mapStu.insert(std::map<int, std::string>::value_type(1, "小李"));  
  
// 第四种 通过数组的方式插入值  
// 这种方式在键已存在时更新对应的值，在键不存在时插入新的键值对  
mapStu[3] = "小刘"; // 注意：这会替换掉key为3的原始值"小张"  
mapStu[5] = "小王";  
// 输出map内容  
for (const auto& kv : mapStu) {  
std::cout << kv.first << ": " << kv.second << std::endl;  
}  

/*map 删*/
mapStu.clear(); //删所有
mapStu.erase(it);//删迭代器指定
mapStu.erase(beg, end);//删key区间
mapStu.erase(key1);  //删key对应
/*map 排序*/
//map是默认升序排列
// 创建一个键为降序的map，使用std::greater<int>作为比较函数  
std::map<int, std::string, std::greater<int>> mapStuDesc;  

```



# unordered_map

`unordered_map` 是一个关联容器，它存储了键值对（key-value pairs），其中每个键（key）都是唯一的。`unordered_map` 使用哈希表来存储元素，这使得它在查找、插入和删除操作中具有平均常数时间复杂度。

- `unordered_map` 不保证元素的顺序，因此元素的迭代顺序可能在不同的运行中不同。
- 哈希表的性能依赖于良好的哈希函数，以避免过多的哈希冲突。
- 与 `std::map` 相比，`unordered_map` 在元素数量较少时可能占用更多的内存。



# pair（数据类型）

类模板：template<class T1,class T2> struct pair

参数：T1是第一个值的数据类型，T2是第二个值的数据类型。

功能：pair将一对值(T1和T2)组合成一个值，

这一对值可以具有不同的数据类型（T1和T2），

两个值可以分别用pair的两个公有函数first和second访问。



```
pair<T1, T2> p1;            //创建一个空的pair对象（使用默认构造），它的两个元素分别是T1和T2类型，采用值初始化。
pair<T1, T2> p1(v1, v2);    //创建一个pair对象，它的两个元素分别是T1和T2类型，其中first成员初始化为v1，second成员初始化为v2。
make_pair(v1, v2);          // 以v1和v2的值创建一个新的pair对象，其元素类型分别是v1和v2的类型。
p1 < p2;                    // 两个pair对象间的小于运算，其定义遵循字典次序：如 p1.first < p2.first 或者 !(p2.first < p1.first) && (p1.second < p2.second) 则返回true。
p1 == p2；                  // 如果两个对象的first和second依次相等，则这两个对象相等；该运算使用元素的==操作符。
p1.first;                   // 返回对象p1中名为first的公有数据成员
p1.second;                 // 返回对象p1中名为second的公有数据成员
```













# Lambda表达式

Lambda表达式是 c++11 引入的一个语法糖，它可以用来定义并创建匿名的函数对象，主要用于方便编程，避免全局变量的定义，并且变量安全。Lambda表达式本质上是一个匿名类的对象，因此它可以赋值给一个函数指针或函数引用，也可以作为模板参数传递给一个泛型函数或类.

```
[capture list] (parameter list) -> return type { function body }
```

分别表示捕获列表、参数列表、返回值类型（可省略）、函数体

## 捕获列表

### 值捕获

捕获的是外面的数据值，在捕获的时候就已经确定，即使后续变量改变，也不会对其造成影响

### 引用捕获

对比于值捕获，改变外部的变量会导致表达式中的值也改变

### 隐式捕获

捕获列表中使用=或&，表示按值或按引用捕获外部所有变量，用于简化书写

### 初始化捕获

允许在捕获时创建一个新的变量

## 使用示例

```
//简单的计算两数的和
auto plus = [](int a,int b) -> int{return a+b};
cout<<plus(3,4)<<endl;
==================================================
// 定义一个函数，返回一个 Lambda表达式，实现两个数的加法
auto make_adder(int x)
{
    return [x] (int y) -> int { return x + y; };
}
int main()
{
    // 调用函数，得到一个 Lambda表达式
    auto add5 = make_adder(5);
    // 调用 Lambda表达式
    cout << add5(10) << endl; // 输出 15
    return 0;
}
==================================================
struct Item
{
    Item(int aa, int bb) : a(aa), b(bb) {}
    int a;
    int b;
};
vector<Item> vec;
    vec.push_back(Item(1, 19));
    vec.push_back(Item(10, 3));
    vec.push_back(Item(3, 7));
    vec.push_back(Item(8, 12));
    vec.push_back(Item(2, 1));

    // 使用 Lambda表达式，根据 Item 中的成员 a 升序排序
    sort(vec.begin(), vec.end(), [] (const Item& v1, const Item& v2) { return v1.a < v2.a; });
```









# 参考文章

[C++：什么是STL？_c++ stl-CSDN博客](https://blog.csdn.net/weixin_41969690/article/details/106648441)

https://blog.csdn.net/u013317445/article/details/89680330

[深入浅出 C++ Lambda表达式：语法、特点和应用_c++ lamda函数作为函数参数-CSDN博客](https://blog.csdn.net/m0_60134435/article/details/136151698)
