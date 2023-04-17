# 플레이 리스트  
## 1. 실행  
```
npm start
```
## 2. 구조  
```javascript
public
src
  - @dto //request, response 스키마
  - @hooks //custom hook
  - @type // enum or types
  - @utils // common function
  - music
```  
## 3. 개발 노트  
* 비지니스 로직은 custom hook 인 use-music 에서 처리하도록 분리.  
    - useQuery 를 이용해서 muiscs api 를 호출하도록 처리.  
    - id 를 전달받아 url 을 가져와야하기 위해서 useMutation 을 이용해서 처리.  
      - 처음엔 url: string 만 전달 받았으나, 아예 player 객체를 만들어서 넘겨주는것이 나을것 같아서 api 호출 후 처리.
* date format 은 toLocalString 을 이용해서 처리.
* emotion 을 이용해서 컴포넌트 스타일 적용.
* player의 재사용성을 위해서 컴포넌트 분리.
* play() and pase() 시 play-request-was-interrupted 발생하여 https://developer.chrome.com/blog/play-request-was-interrupted/ 해당 문서를 참조하여 promise 처리를 추가함.

## 4. 사용한 플러그인
* react
* axios
* react-query
* emotion 