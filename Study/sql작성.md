# sql 

### 경로찾기

> cd C:\Bitnami\wampstack-version\mysql\bin\ ./mysql uroot -p

### 관리자 권한으로 실행

> mysql -uroot p 

name이란 이름의 테이블 생성 
> CREATE DATABASE {name};

### 데이터베이스 사용

> USE {databasename};

### 데이터 베이스 조회

> SHOW DATABASES;>

### 테이블 생성 예제

> CREATE TABLE topic(
> 	id INT(11) NOT NULL AUTO_INCREMENT,	// 아이디 11개까지만출력 값없는거 허용 x
> 									// 자동증가
> 	title VARCHAR(100) NOT NULL,
> 	description TEXT NULL,
> 	created DATETIME NOT NULL,			// 날짜
> 	author VARCHAR(30) NULL,
> 	profile VARCHAR(100) NULL,
> 	PRIMARY KEY(id));			// 고유 프라임 키
> )

### 생성된 테이블 보기

> SHOW TABLES;

### 테이블 보기

> DESC {테이블이름} 

### 데이터 삽입

> INSERT INTO {name} (arg1,arg2,arg3,arg4...) VALUES(arg1value,arg2value,arg3value...);

시간은 NOW() 함수로

### 데이터 업데이트

> UPDATE {tablename} SET {key} = '{value}', title = '{title}' WHERE id = ???

