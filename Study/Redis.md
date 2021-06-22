# redis nodejs 연동

#### redis

nosql db 레디스는 im-memory db로 메모리에 직접 접근하며 읽고 쓰기 때문에 디스크를 읽는 것보다 훨씬 빠르다.  보통 세션을 구현할 때 파일스토어를 사용하지 않고 db를 이용해 세션을 이용하는 것이 일반적이다. 보통 db는 네트워크 비용이 든다. 


[https://github.com/microsoftarchive/redis/releases/tag/win-3.2.100](https://github.com/microsoftarchive/redis/releases/tag/win-3.2.100)

위 깃허브에서 **Redis-x64-3.2.100.msi** 를 다운받자
next 신공을 누르면서 다운로드 터미널로 간단히 켜보자

> redis-cli

터미널에서 실행된다. 
node와 연동도 해보자 ~

```javascript
const redis = require('redis');
const client = redis.createClient();
```

#### 기본사용법

자세한건 [https://www.npmjs.com/package/redis](https://www.npmjs.com/package/redis) 를 보자

기본적인 키 - 값 

```javascript
client.set('name' , 'king');
client.get('name', (err, value) => console.log(value));
```

키 - 해쉬 객체를 저장한다.

```javascript
client.hmset('key' ,{
	'a' : '1',
	'b' : '2'
});
client.hgetall('a', (err, value) =>{
	console.log(value);	// 객체를 반환
})
```

list 는 키 - 배열 rpush는 꼬리에 푸쉬 lpush는 머리에 푸쉬 range를 사용 

```javascript
client.rpush('hero','cap','thor','thanos');
client.lpush('hero','batman','me');
client.lrange('hero', 0, -1, (err, data) => {
	data.forEach((element, idx) => console.log(element);)
	// 출력순서는 me -> bat -> cap -> thor -> thanos
	// lpush 메소드는 헤드부터 삽입이다.
});
```

set 은 키 - 배열 이지만 중복을 허용하지 않는다.

```javascript
client.sadd('numbers','1','2','3','4');
client.sadd('numbers','4');
client.smembers('numbers', (err, data) => {
	console.log(data); // 1,2,3,4
})
```

정렬 셋 내림차순은 zrevrange 사용

```javascript
client.zadd('sort', 
    532 , 'a',
    45 , 'b',
    9 , 'c'
  );
  client.zrange('sort', 0, -1, (err, data) => {
    console.log(data); 		// c b a
  });
```
