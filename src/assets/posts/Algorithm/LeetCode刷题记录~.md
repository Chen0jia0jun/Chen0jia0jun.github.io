```
1.
#include <stdio.h>

int main() {
    int array[100] = {
        5, 6, 8, 6, 9, 1, 6, 1, 2, 4, 9, 1, 9, 8, 2, 3, 6, 4, 7, 7,
        5, 9, 5, 0, 3, 8, 7, 5, 8, 1, 5, 8, 6, 1, 8, 3, 0, 3, 7, 9,
        2, 7, 0, 5, 8, 8, 5, 7, 0, 9, 9, 1, 9, 4, 4, 6, 8, 6, 3, 3,
        8, 5, 1, 6, 3, 4, 6, 7, 0, 7, 8, 2, 7, 6, 8, 9, 5, 6, 5, 6,
        1, 4, 0, 1, 0, 0, 9, 4, 8, 0, 9, 1, 2, 8, 5, 0, 2, 5, 3, 3
    };
	int ans = 0;
    int days[13] = {0,31,28,31,30,31,30,31,31,30,31,30,31};
    for(int month = 1;month<=12;month++){
    	for(int day = 1;day<=days[month];day++){
			int cmp[8] = {2,0,2,3,month/10,month%10,day/10,day%10};
			int k = 0;
			for(int i = 0;i<100;i++){
				if(array[i] == cmp[k]) {
				k++;
				if(k == 8) {
					ans++;
					break;	
			}
            }
			}	
		}
	}
    printf("%d",ans);  
    return 0;
}
```

ps：1.照抄的时候if之后语句的范围都弄错了
		2.将“==”写成了“=”
		3.漏了一个month%10

## 2.平衡二叉树

官方题解里有两种思路，一种是自顶向下，另一种是自底向上；我比较菜，没想一会就看的答案，理解的是自顶向下的。

1）

```c
int height(struct TreeNode* root) {
    if (root == NULL)
        return 0;
    else
        return fmax(height(root->left), height(root->right)) + 1;
}//+1是因为根节点本身高度为一，递归的时候不断加1即得高度

bool isBalanced(struct TreeNode* root) {
    if (root == NULL)
        return true;
    else
        return fabs(height(root->left) - height(root->right)) <= 1 &&
               isBalanced(root->left) && isBalanced(root->right);
} // 为什么还要多加&&后面的那些条件？root->left这些不是已经计算出高度是否相差超过一了吗
 		x
    x        x
  x          	x
x                    //如果不加后面的那些条件，那这种情况分明不是平衡二叉树，但也会被认为是平衡二叉树；（平衡二叉树的子树也都是平衡二叉树）            



```

2）自底向上

因为每个节点最多只用遍历一次，在判断的时候，只用判断一次高度即可，因此时间复杂度更优

```c
int height(struct TreeNode* root) {
    if (root == NULL)
        return 0;
    int leftheight = height(root -> left);
    int rightheight = height(root -> right);
    if(leftheight == -1 || rightheight == -1 || fabs(leftheight - rightheight)>1)
        return -1;
    else
        return fmax(leftheight,rightheight) + 1;
}


bool isBalanced(struct TreeNode* root) {
    if (root == NULL)
        return true;
    else
       return height(root) > 0;
} 
```

## 3.二叉树搜索

1）深度优先搜索

```c
int maxDepth(struct TreeNode* root) {
    if(root == NULL) return 0;
    else return fmax(maxDepth(root->left),maxDepth(root->right)) +1;
}
```

2）广度优先搜索

一层一层的搜索，一层完事之后再扩展到下一层

```

```

malloc函数：[c语言malloc函数的用法和意义-CSDN博客](https://blog.csdn.net/qq_42565910/article/details/90346236)

fabs函数：[C/C++ fabs 函数 - C语言零基础入门教程-CSDN博客](https://blog.csdn.net/ZhaDeNianQu/article/details/121379617)



## 4.二叉树最小深度

```C
int minDepth(struct TreeNode* root) {
    if(root == NULL) return 0;
    int left = minDepth(root->left);
    int right = minDepth(root->right);
    if(root->left == NULL || root->right == NULL) return left+right+1;
    else return fmin(left,right)+1;
}
```

## 5.中序遍历--

输出结果的方式值得学习，思路很简单；

还有就是没完全搞懂每个地方的引用的必要性

```c
void inorder(struct TreeNode* root,int* res,int* returnSize){
    if(root == NULL) return;
    inorder(root->left,res,returnSize);
    res[(*returnSize)++] =root->val;
    inorder(root->right,res,returnSize);
}


int* inorderTraversal(struct TreeNode* root, int* returnSize) {
    int* res =malloc(sizeof(int)*501);
    *returnSize = 0;
    inorder(root,res,returnSize);
    return res;
}
```

## 6.美丽数组最小和

```c
int minimumPossibleSum(int n, int target){
    int mod = 1e9+7;
    long long m = target/2;
    long long ans = 0;

    if(n<=m) ans = ((1+n)*n/2)%mod;
    else ans = ((1 + m)*m/2 + (target + target+(n-m)-1)*(n-m)/2)%mod;

    return ans;
}
```

## 7.二叉树最小深度

```c
int minDepth(struct TreeNode* root) {
    if(root == NULL) return 0;
    int left = minDepth(root->left);
    int right = minDepth(root->right);
    if(root->left == NULL || root->right == NULL) return left+right+1;
    else return fmin(left,right)+1;
}
```

## 8.二叉树的最大深度

```c
int maxDepth(struct TreeNode* root) {
    if(root == NULL) return 0;
    else return fmax(maxDepth(root->left),maxDepth(root->right)) +1;
}
```

## 9.合并两个有序数组//第一次自己写出来#_#

```c
void merge(int* nums1, int nums1Size, int m, int* nums2, int nums2Size, int n) {
    for(int i = m,j = 0;i<m+n,j<n;i++,j++){
        nums1[i] = nums2[j];
    }
    int temp;
    for(int i = 0;i<n+m;i++){
        for(int j =i+1;j<n+m;j++){
            if(nums1[i]>nums1[j]){
                temp = nums1[i];
                nums1[i] = nums1[j]; 
                nums1[j] = temp;
            }
        }
    }
}
```

时间复杂度和空间复杂度最优的版本

```c
void merge(int* nums1, int nums1Size, int m, int* nums2, int nums2Size, int n) {
    int p1 = m - 1, p2 = n - 1;
    int tail = m + n - 1;
    int cur;
    while (p1 >= 0 || p2 >= 0) {
        if (p1 == -1) {
            cur = nums2[p2--];
        } else if (p2 == -1) {
            cur = nums1[p1--];
        } else if (nums1[p1] > nums2[p2]) {
            cur = nums1[p1--];
        } else {
            cur = nums2[p2--];
        }
        nums1[tail--] = cur;
    }
}
```

## 10，相交链表

```C
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     struct ListNode *next;
 * };
 */
struct ListNode *getIntersectionNode(struct ListNode *headA, struct ListNode *headB) {
    /*struct ListNode* intersectVal;
    while(headA !=NULL){
        while(headB!=NULL){
            if(headA->val == headB->val) intersectVal = headB;
            headB = headB->next;
        }
        headA =headA->next;
    }
    return intersectVal;*/
}
```

```c

struct HashTable {
    struct ListNode *key;
    UT_hash_handle hh;
};

struct ListNode *getIntersectionNode(struct ListNode *headA, struct ListNode *headB) {
    struct HashTable *hashTable = NULL;
    struct ListNode *temp = headA;
    while (temp != NULL) {
        struct HashTable *tmp;
        HASH_FIND(hh, hashTable, &temp, sizeof(struct HashTable *), tmp);
        if (tmp == NULL) {
            tmp = malloc(sizeof(struct HashTable));
            tmp->key = temp;
            HASH_ADD(hh, hashTable, key, sizeof(struct HashTable *), tmp);
        }
        temp = temp->next;
    }
    temp = headB;
    while (temp != NULL) {
        struct HashTable *tmp;
        HASH_FIND(hh, hashTable, &temp, sizeof(struct HashTable *), tmp);
        if (tmp != NULL) {
            return temp;
        }
        temp = temp->next;
    }
    return NULL;
}
```









