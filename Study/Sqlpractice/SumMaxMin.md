# Sum Max Min

![sqlanimal](https://user-images.githubusercontent.com/43857226/84896048-36646980-b0de-11ea-8fe6-c9cba5f423e1.PNG)

ANIMAL_INS 테이블은 동물 보호소에 들어온 동물의 정보를 담은 테이블입니다. </br>
ANIMAL_INS 테이블 구조는 다음과 같으며, ANIMAL_ID, ANIMAL_TYPE, DATETIME, INTAKE_CONDITION, NAME,SEX_UPON_INTAKE는 </br>
각각 동물의 아이디, 생물 종, 보호 시작일, 보호 시작 시 상태, 이름, 성별 및 중성화 여부를 나타냅니다.</br>

## 최대값 구하기

가장 최근에 들어온 동물은 언제 들어왔는지 조회하는 SQL 문을 작성해주세요. </br>

```
SELECT DATETIME
FROM ANIMAL_INS
ORDER BY DATETIME DESC
LIMIT 1
```

## 최소값 구하기

동물 보호소에 가장 먼저 들어온 동물은 언제 들어왔는지 조회하는 SQL 문을 작성해주세요. </br>


```
SELECT DATETIME
FROM ANIMAL_INS
ORDER BY DATETIME
LIMIT 1
```

## 동물 수 구하기

동물 보호소에 동물이 몇 마리 들어왔는지 조회하는 SQL 문을 작성해주세요.</br>

```
SELECT COUNT(*)
FROM ANIMAL_INS
```

## 중복제거하기

동물 보호소에 들어온 동물의 이름은 몇 개인지 조회하는 SQL 문을 작성해주세요. 이때 이름이 NULL인 경우는 집계하지 않으며 중복되는 이름은 하나로 칩니다.</br>

```
SELECT COUNT(DISTINCT NAME) count
FROM ANIMAL_INS
```
