# my-first-project
스파르타 숙련주차 과제

# 환경변수
JWT =
ENCRYPT =
RDS_NAME =
RDS_PASSWORD =
RDS_ENDPOINT =

# API 명세서 URL

- 구글 Docs 공유 URL 추가
A.  https://docs.google.com/spreadsheets/d/1rsRIkVQD7BnJAj5gtkVIXNgSgJiqnNNNe-YqmDszchs/edit#gid=0

# ERD URL

- ERD Cloud URL 추가
A. https://www.erdcloud.com/d/yq74D5FNrm9xRxjy6

# 더 고민해 보기

1. **암호화 방식**
- 비밀번호를 DB에 저장할 때 Hash를 이용했는데, Hash는 `단방향 암호화`와 `양방향 암호화` 중 어떤 암호화 방식에 해당할까요?
A. hash 는 단방향 암호화 기법입니다
  
- 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?
A. 원본 데이터를 복원하는것이 매우 어렵거나 거의 불가능하다

2. **인증 방식**
- JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요?
A. 토큰의 무단 사용, 변조, 민감한 정보 노출, 유효 기간 문제 등 이 있습니다

- 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?
A. 보완 방법 으로는

1. 무단 사용에 대하여 : HTTPS 사용, 강력한 랜덤 키 사용 등 의 방법으로 무단 사용을 어렵게 한다

2. 변조에 대하여 : 토큰 서명 사용

3. 민감한 정보 노출 : 최소한의 정보만 토큰에 포함시키도록 합니다

4. 유효 기간 문제에 대하여 : 유효 기간을 짧게 유지하며 Refresh Token 과 함께 사용하여 새로운 토큰을 발급하는 방식으로 도입

이 있습니다

3. **인증과 인가**
- 인증과 인가가 무엇인지 각각 설명해 주세요.
A.인증은 사용자가 시스템이나 서비스에 대해 누구인지 확인하는 과정
인가는 인증된 사용자에 대해 어떤 리소스에 접근할 권한이 있는지 결정하는 과정

- 과제에서 구현한 Middleware는 인증에 해당하나요? 인가에 해당하나요? 그 이유도 알려주세요.
A. 둘 다에 해당합니다

인증 Middleware 는 사용자의 신원을 확인하고 사용자가 제공한 인증 정보를 기반으로 사용자를 식별하는 역할을 하기 때문에
수정, 로그아웃 등 에 사용됩니다

인가 Middleware 는 사용자의 권한을 확인하고, 특정 리소스에 접근할 수 있는지 여부를 결정하는 역할을 하기 때문에
로그인, 회원가입 등에 사용됩니다


4. **Http Status Code**
- 과제를 진행하면서 `사용한 Http Status Code`를 모두 나열하고, 각각이 `의미하는 것`과 `어떤 상황에 사용`했는지 작성해 주세요.

- 200 : 요청이 성공적으로 되었습니다. 정보는 요청에 따른 응답으로 반환됩니다.
- 어떠한 요청에 대하여 성공하여 True를 반환할 때 사용하였습니다

- 400 Bad Request : 이 응답은 잘못된 문법으로 인하여 서버가 요청하여 이해할 수 없음을 의미합니다.
- 최종적으로 실패 하였을 때, catch문 뒤에 사용해주었습니다

- 401 Unauthorized 비록 HTTP 표준에서는 '미승인(unauthorized)'를 명확히 하고 있지만, 의미상 이 응답은 '비인증(unauthenticated)'를 의미합니다. 클라이언트는 요청한 응답을 받기 위해서는 반드시 스스로를 인증해야 합니다.
- 어떠한 입력값, 호출값에 대하여 오류가 있어 정정 및 재확인을 요청할 때 주로 사용해주었습니다


5. **리팩토링**
- MongoDB, Mongoose를 이용해 구현되었던 코드를 MySQL, Sequelize로 변경하면서, 많은 코드 변경이 있었나요? 주로 어떤 코드에서 변경이 있었나요?
A. method 사용법이 바뀌었습니다
- 만약 이렇게 DB를 변경하는 경우가 또 발생했을 때, 코드 변경을 보다 쉽게 하려면 어떻게 코드를 작성하면 좋을 지 생각나는 방식이 있나요? 있다면 작성해 주세요.
A. 조금 더 고심해보고 작성하겠습니다

6. **서버 장애 복구**
- 현재는 PM2를 이용해 Express 서버의 구동이 종료 되었을 때에 Express 서버를 재실행 시켜 장애를 복구하고 있습니다. 만약 단순히 Express 서버가 종료 된 것이 아니라, AWS EC2 인스턴스(VM, 서버 컴퓨터)가 재시작 된다면, Express 서버는 재실행되지 않을 겁니다. AWS EC2 인스턴스가 재시작 된 후에도 자동으로 Express 서버를 실행할 수 있게 하려면 어떤 조치를 취해야 할까요?
(Hint: PM2에서 제공하는 기능 중 하나입니다.)
A. Startup Hooks 를 이용하면 됩니다.

7. **개발 환경**
- nodemon은 어떤 역할을 하는 패키지이며, 사용했을 때 어떤 점이 달라졌나요?
A. 저장을 할 때마다 자동으로 서버를 재시작 해줍니다 달라진 점은 편리합니다

- npm을 이용해서 패키지를 설치하는 방법은 크게 일반, 글로벌(`--global, -g`), 개발용(`--save-dev, -D`)으로 3가지가 있습니다. 각각의 차이점을 설명하고, nodemon은 어떤 옵션으로 설치해야 될까요?
A. 사용해보고 수정 하겠습니다
