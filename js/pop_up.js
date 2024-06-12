function addJavascript(jsname) { // 자바스크립트 외부 연동
    var th = document.getElementsByTagName('head')[0];
    var s = document.createElement('script');
    s.setAttribute('type','text/javascript');
    s.setAttribute('src',jsname);
    th.appendChild(s);
}
    
addJavascript('js/security.js'); // 암복호화 함수
addJavascript('js/cookie.js'); // 세션 함수
addJavascript('js/cookie.js'); // 쿠키 함수



function pop_up(){
    var cookieCheck = getCookie("popupYN");
    if(cookieCheck != "N"){
        window.open("../popup/popup.html", "팝업테스트", "width=300, height=300, top=10, left=10");
    }
} //가로400, 세로300, 위 10, 왼쪽 10 여백
//window.open()함수는 창을 열거나 닫는(.close) 전용 함수

function setCookie(name, value, expiredays){
    var date = new Date();
    date.setDate(date.getDate() + expiredays);
    document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString() + "; path=/" + ";SameSite=None; Secure";
}

function getCookie(name){
    var cookie = document.cookie;
    console.log("쿠키를 요청합니다.");
    if(cookie != ""){
        var cookie_array = cookie.split("; ");
        for (var index in cookie_array){
            var cookie_name = cookie_array[index].split("=");

            if(cookie_name[0] == "popupYN"){
                return cookie_name[1];
            }
        }
    }
    return;
}

function show_time() {
    let divClock = document.getElementById('Time');
    if (divClock) {
        divClock.innerText = close_time2;
        close_time2--;
        setTimeout(show_time, 1000);
    } else {
        console.error("Element with ID 'Time' not found.");
    }
}



function over(obj) {
    obj.src="image/LOCO.png";
}
function out(obj) {
    obj.src="image/LOCO_2.png";
}

function closePopup(){
    if(document.getElementById(`check_popup`).value){
        setCookie("popupYN", "N", 1);
        alert("쿠키를 설정합니다.");
        self.close();
    }
}

function show_clock(){
    //현재 시스템 날짜 객체 생성
    let currentDate = new Date();
    let divClock = document.getElementById(`divClock`);
    let msg = "현재시간: ";

    // 12시보다 크면 오후, 작으면 오전
    if(currentDate.getHours() > 12){
        msg += "오후";
        msg += currentDate.getHours()-12+ "시"; 
    }
    else{
        msg += "오전";
        msg += currentDate.getHours()+ "시";
    }

    msg += currentDate.getMinutes() + "분";
    msg += currentDate.getSeconds() + "초";
    divClock.innerText = msg;

    // 정각 1분 전 빨간색 출력
    if(currentDate.getMinutes()>58){
        divClock.style.color="red";
    }

    // 1초마다 갱신
    setTimeout(show_clock, 1000);
}

function over(obj) {
    obj.src="image/LOGO.svg";
}
function out(obj){
    obj.src="image/LOGO_2.png";
}

