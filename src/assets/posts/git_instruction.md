# Git常用指令 | 项目Git管理流程 

学习这类指令，无外乎学习如何**增删改查，**进阶一点的操作则是遇到了对应的场景再去学习。

## Git流程

先从服务器克隆一个库并上传

```
git clone ssh://example.com/~/www/project.git
```

创建新分支并进入新分支

```
git branch test
// 切换分支
git checkout main
```

提交修改到暂存区

若是分支上的提交，提交前建议合并一下主分支

```
git merge main
```

```
git add .
git add *.md
```

若提交错误，想撤回

```
git reset HEAD
// 撤回某个文件
git reset HEAD src/test.js
```

提交修改

```
git commit -m "feat: ...."
```

### git 提交规范

commit message = subject + ：+ 空格 + message 主体

> 常见的 subject 种类以及含义如下：
>
> **feat**: 新功能（feature）
>
> 用于提交 bug 修复。
>
> **docs**: 文档变更
>
> **style**: 代码风格变动（不影响代码逻辑）
>
> **refactor**: 代码重构（既不是新增功能也不是修复bug的代码更改）
>
> 用于提交代码重构。
>
> **perf**: 性能优化
>
> **test**: 添加或修改测试
>
> **chore**: 杂项（构建过程或辅助工具的变动）
>
> **build**: 构建系统或外部依赖项的变更
>
> **ci**: 持续集成配置的变更
>
> 用于提交CI配置文件和脚本的修改。
> 例如：ci: 修改GitHub Actions配置文件
>
> **revert**: 回滚



修改后推送到服务器

```
git push
// 若没有绑定上游分支
git push -u origin "feat/test"
```

取回更新

如果您已经按上面的进行push，下面命令表示，当前分支自动与唯一一个追踪分支进行合并。

```
git pull
```



## 配置用户信息

```
git config --global user.name "admin"
git config --global user.email admin@git.com
```

## 查看配置信息

```
git config --list
```

## 创建仓库（repository）

到达相应的文件夹或者目录，初始化其为Git仓库

```
git init
```

使用指定目录作为Git仓库

```
git init newrepo
```

## 克隆仓库

```
//当前目录
git clone git://github.com/schacon/grit.git
//指定目录
git clone git://github.com/schacon/grit.git mygrit
//指定分支
git clone -b develop git://github.com/schacon/grit.git 
```

## 删除 分支与合并

删除

```
git rm file
```

创建分支

```
git branch test
```

进入（主）分支

```
git checkout test
//进入主分支
git checkout master
```

删除分支

```
git branch -d test
```

合并

```
git checkout master
git merge test
```



## 创建并提交文件

### 1.创建文件

windows

```
echo test>文件名
```

Linux

```
touch 文件名
```

### 2.添加文件到缓存区（本地仓库）

```
git add 文件名
// 提交全部修改或创建的文件
git add .
```

### 3.提交修改到远程仓库

```
git commit -m "first commit"
```

`-m` 参数后面跟着的是这次提交的描述或信息



```
git remote add origin https://gitee.com/martyrs-are-also/test0613.git
```

origin 是该远程仓库的别名



```
git push -u origin "master"
```

将master的本地分支的修改推送到主分支



### 4.更新本地仓库（与远程仓库同步）

```
git fetch
```



# 参考链接

https://www.runoob.com/git/git-tag.html

https://blog.csdn.net/chenyajundd/article/details/139322838
