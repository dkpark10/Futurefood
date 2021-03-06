# String, Data 

[https://programmers.co.kr/learn/courses/30/parts/17047](https://programmers.co.kr/learn/courses/30/parts/17047)</br>

![sqlanimal](https://user-images.githubusercontent.com/43857226/84896048-36646980-b0de-11ea-8fe6-c9cba5f423e1.PNG)

ANIMAL_INS 테이블은 동물 보호소에 들어온 동물의 정보를 담은 테이블입니다. </br>
ANIMAL_INS 테이블 구조는 다음과 같으며, ANIMAL_ID, ANIMAL_TYPE, DATETIME, INTAKE_CONDITION, NAME,SEX_UPON_INTAKE는 </br>
각각 동물의 아이디, 생물 종, 보호 시작일, 보호 시작 시 상태, 이름, 성별 및 중성화 여부를 나타냅니다.</br>

## 루시와 엘라 찾기

동물 보호소에 들어온 동물 중 이름이 Lucy, Ella, Pickle, Rogan, Sabrina, Mitty인 동물의 아이디와 이름, 성별 및 중성화 여부를 조회하는 SQL 문을 작성해주세요.

```sql
select animal_id, name, sex_upon_intake
from animal_ins
where name in('Lucy','Ella','Pickle','Rogan','Sabrina','Mitty')
order by animal_id
```

## 이름에 el이 있는 동물

보호소에 돌아가신 할머니가 기르던 개를 찾는 사람이 찾아왔습니다. 이 사람이 말하길 할머니가 기르던
개는 이름에 'el'이 들어간다고 합니다. 동물 보호소에 들어온 동물 이름 중, 이름에 EL이 
들어가는 개의 아이디와 이름을 조회하는 SQL문을 작성해주세요. 이때 결과는 이름 순으로 
조회해주세요. 단, 이름의 대소문자는 구분하지 않습니다.

```sql
select animal_id, name
from animal_ins
where animal_type = 'Dog' and
name like '%el%'
order by name
```

## 중성화 여부 파악하기

보호소의 동물이 중성화되었는지 아닌지 파악하려 합니다. 중성화된 동물은 SEX_UPON_INTAKE 컬럼에
'Neutered' 또는 'Spayed'라는 단어가 들어있습니다. 동물의 아이디와 이름, 중성화 여부를 
아이디 순으로 조회하는 SQL문을 작성해주세요. 이때 중성화가 되어있다면 'O', 아니라면 'X'라고 표시해주세요.

```sql
select animal_id, name , case
when sex_upon_intake like '%Neutered%' then 'O'
when sex_upon_intake like '%Spayed%' then 'O'
else 'X'
end as '중성화'
from animal_ins
```

## 오랜기간 보호한 동물2

입양을 간 동물 중, 보호 기간이 가장 길었던 동물 두 마리의 아이디와
이름을 조회하는 SQL문을 작성해주세요. 이때 결과는 보호 기간이 긴 순으로 조회해야 합니다.

```sql
select ii.animal_id , ii.name
from animal_ins ii left join animal_outs oo on ii.animal_id = oo.animal_id 
where datediff(ii.datetime, oo.datetime) is not null
order by datediff(ii.datetime, oo.datetime) limit 2
```

## DATETIME에서 DATE로 형 변환

ANIMAL_INS 테이블에 등록된 모든 레코드에 대해, 각 동물의 아이디와 이름,
들어온 날짜1를 조회하는 SQL문을 작성해주세요. 이때 결과는 아이디 순으로 조회해야 합니다.

```
select animal_id, name, date_format(datetime, '%Y-%m-%d') as '날짜'
from animal_ins
order by animal_id
```
