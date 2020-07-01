# Sum Max Min

![sqlanimal](https://user-images.githubusercontent.com/43857226/84896048-36646980-b0de-11ea-8fe6-c9cba5f423e1.PNG)

ANIMAL_INS 테이블은 동물 보호소에 들어온 동물의 정보를 담은 테이블입니다. </br>
ANIMAL_INS 테이블 구조는 다음과 같으며, ANIMAL_ID, ANIMAL_TYPE, DATETIME, INTAKE_CONDITION, NAME,SEX_UPON_INTAKE는 </br>
각각 동물의 아이디, 생물 종, 보호 시작일, 보호 시작 시 상태, 이름, 성별 및 중성화 여부를 나타냅니다.</br>

## 고양이와 개는 몇마리 있었을까

```
SELECT ANIMAL_TYPE , COUNT(*)as 'count'
FROM ANIMAL_INS 
GROUP BY ANIMAL_TYPE 
ORDER BY ANILAM_TYPE
```

그룹바이로 동물타입끼리 묶고 정렬 ㄱㄱㄱㄱㄱㄱ

## 동명 동물 수 찾기 

```
SELECT NAME, COUNT FROM
  (SELECT NAME, COUNT(NAME) AS 'COUNT'
  FROM ANIMAL_INS
  GROUP BY NAME) TMP
WHERE COUNT > 1
```

서브 쿼리를 사용하여 

```
select name, count(*) as 'count'
from animal_ins 
group by name
having count(name) > 1
order by name
```

having count를 사용하여 

## 입양시각 구하기

9 ~ 19:59까지 각시간대 입양건이 몇 건이나 발생했는지 

```
SELECT HOUR(DATETIME) AS 'HOUR', COUNT(*) AS 'COUNT'
FROM ANIMAL_INS
GROUP BY HOUR
HAVING HOUR >= 9 AND HOUR <= 19 
ORDER BY HOUR 
```

## 입양시각 구하기

0 ~ 24 까지 0으로 조회된 것도 모두 다 출력

```
set @hour = -1;
select (@hour := @hour + 1) as 'hour',
(select count(*) from animal_outs where hour(datetime) = @hour) as 'count'
from animal_outs
where @hour < 23
```
