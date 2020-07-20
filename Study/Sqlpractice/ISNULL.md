# ISNULL 

[https://programmers.co.kr/learn/courses/30/parts/17045](https://programmers.co.kr/learn/courses/30/parts/17045)</br>

![sqlanimal](https://user-images.githubusercontent.com/43857226/84896048-36646980-b0de-11ea-8fe6-c9cba5f423e1.PNG)

ANIMAL_INS 테이블은 동물 보호소에 들어온 동물의 정보를 담은 테이블입니다. </br>
ANIMAL_INS 테이블 구조는 다음과 같으며, ANIMAL_ID, ANIMAL_TYPE, DATETIME, INTAKE_CONDITION, NAME,SEX_UPON_INTAKE는 </br>
각각 동물의 아이디, 생물 종, 보호 시작일, 보호 시작 시 상태, 이름, 성별 및 중성화 여부를 나타냅니다.</br>

## 이름이 없는 동물찾기

동물 보호소에 들어온 동물 중, 이름이 없는 채로 들어온 동물의 ID를 조회하는 SQL 문을 작성해주세요. 단, ID는 오름차순 정렬되어야 합니다.

```sql
select animal_id 
from animal_ins
where name is NULL
```

## 이름이 있는 동물

동물 보호소에 들어온 동물 중, 이름이 있는 동물의 ID를 조회하는 SQL 문을 작성해주세요. 단, ID는 오름차순 정렬되어야 합니다.

```sql
select animal_id 
from animal_ins 
where name is not NULL
order by animal_id
```

## NULL처리하기

입양 게시판에 동물 정보를 게시하려 합니다. 동물의 생물 종, 이름, 성별 및 중성화 여부를 
아이디 순으로 조회하는 SQL문을 작성해주세요. 이때 프로그래밍을 모르는 사람들은 NULL이라는
기호를 모르기 때문에, 이름이 없는 동물의 이름은 No name으로 표시해 주세요.


```sql
select animal_type, ifnull(name,'No name') as name , sex_upon_intake
from animal_ins
order by animal_id
```
