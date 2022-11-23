>## 게시판 크롤링 프로그램

USER, POST, COMMENT에 대해서 -> 

누가 post를 언제 작성하였는지.

post에 user가 comment를 달고, post_writer가 reple를 달아준 것까지만 확인.


### 1 테이블 생성해야함.

* ./database/table.sql 에 적어뒀음.
* 최대한 변경 안하는게 다른코드 수정안해도되니깐 좋을거라 생각함
* USER, POST, COMMENT만 크롤링함. (id, nickname, time 정보만 수집)

### 2 crawl directory만 조금 수정하면 아무때나 다 사용가능할거라 생각함.
* 크롤링 원하는 곳 URL PATH
* html tag path
* item [name, path]


### 3 .ENV파일 작성
* url host
* db access url, username, password

> ## 기능적인 수정 부분 필요
1. lastest 글이 삭제되면 
    -> 쿼리에서 time을 가지고 오는 방법
    -> Table을 하나 더 만들어서 최근 실행시간 (이게 맞을거같음)
2. 각각의 POST에 들어가서 댓글을 가지고 오는 부분에서 중복 확인이랑 댓글 크롤링 하는 부분을 분리해서 병렬적으로 실행되는지 확인하기 %% 필수

> ## 추가적으로 수정 필요한 부분
1. 중복문제 해결 (O)
2. 리팩토링 필요함 (O)
3. 함수 파라미터 깔끔하게 만들기 (variable -> Obejct) (O)
4. 도커로 바로 실행가능하게 만들기(AWS같은곳에 DB구축해야하는데 모르겠다)
5. github action으로도 사용할 수 있게 하기 (CRON batch방식으로) -> 4번 해결되면

