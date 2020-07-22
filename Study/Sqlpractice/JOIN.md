# JOIN 연습

[https://programmers.co.kr/learn/challenges?selected_part_id=17046](https://programmers.co.kr/learn/challenges?selected_part_id=17046)

## 없어진 기록찾기 

천재지변으로 인해 일부 데이터가 유실되었습니다. 입양을 간 기록은 있는데, 
보호소에 들어온 기록이 없는 동물의 ID와 이름을 ID 순으로 조회하는 SQL문을 작성해주세요.

```sql
select oo.animal_id , oo.name 
from animal_ins ii right join animal_outs oo on oo.animal_id = ii.animal_id
where ii.animal_id is null 
order by oo.animal_id
```

조인해서 아이디 널값인거 찾자 

## 있었는데요 없었습니다

관리자의 실수로 일부 동물의 입양일이 잘못 입력되었습니다. 보호 시작일보다 입양일이
더 빠른 동물의 아이디와 이름을 조회하는 SQL문을 작성해주세요. 이때 결과는 보호 시작일이 빠른 순으로 조회해야합니다.

```sql
select ii.animal_id, ii.name
from animal_ins ii left join animal_outs oo on ii.animal_id = oo.animal_id
where ii.datetime > oo.datetime
order by ii.datetime
```

역시 조인해서 데이트값 비교 하면 된다.

## 오랜기간 보호한 동물

아직 입양을 못 간 동물 중, 가장 오래 보호소에 있었던 동물 3마리의 이름과 
보호 시작일을 조회하는 SQL문을 작성해주세요. 이때 결과는 보호 시작일 순으로 조회해야 합니다.

```sql
select ii.name , ii.datetime
from animal_ins ii left join animal_outs oo on ii.animal_id = oo.animal_id
where oo.animal_id is null 
order by ii.datetime 
limit 3
```

아이디 널값이면 보호소에 남아있는 동물 리미트3으로 3마리만 출력 ~~

## 보호소에서 중성화한 동물

보호소에서 중성화 수술을 거친 동물 정보를 알아보려 합니다. 보호소에 들어올 당시에는 중성화되지 않았지만,
보호소를 나갈 당시에는 중성화된 동물의 아이디와 생물 종, 이름을 조회하는 아이디 순으로 조회하는 SQL 문을 작성해주세요.

```sql
select oo.animal_id, oo.animal_type, oo.name 
from animal_outs oo left join animal_ins ii on oo.animal_id = ii.animal_id
where ii.sex_upon_intake like 'Intact%' and (oo.sex_upon_outcome like 'Spayed%' or oo.sex_upon_outcome like 'Neutered%')
```

이건 어렵다 like구문으로 중성화 여부 다 찾아주자 like구문은 모든 문자를 조건에 따라 다 찾아준다.
