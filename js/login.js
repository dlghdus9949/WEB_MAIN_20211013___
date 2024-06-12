// 자바스크립트 파일을 동적으로 로드하는 함수
function addJavascript(jsname) {
    var th = document.getElementsByTagName('head')[0]; // HTML 문서의 <head> 요소를 가져옴
    var s = document.createElement('script'); // 새로운 <script> 요소를 생성
    s.setAttribute('type', 'text/javascript'); // 스크립트 타입을 설정
    s.setAttribute('src', jsname); // 스크립트 파일 경로를 설정
    th.appendChild(s); // <head> 요소에 스크립트를 추가하여 로드
}

// 외부 자바스크립트 파일 로드
addJavascript('js/security.js'); // 암복호화 함수
addJavascript('js/session.js'); // 세션 함수
addJavascript('js/cookie.js'); // 쿠키 함수

// 페이지 로딩 시 초기화 함수
function init() {
    const emailInput = document.getElementById('typeEmailX'); // 이메일 입력 요소
    const idsave_check = document.getElementById('idSaveCheck'); // 아이디 저장 체크박스
    let savedId = getCookie('id'); // 저장된 쿠키에서 아이디를 가져옴

    // 쿠키에 저장된 아이디가 있을 경우
    if (savedId) {
        emailInput.value = savedId; // 이메일 입력 필드에 저장된 아이디를 설정
        if (idsave_check) {
            idsave_check.checked = true; // 아이디 저장 체크박스를 체크 상태로 설정
        }
    }
    session_check(); // 세션 유무 검사
}

// 로그인 시도 및 로그인 시도 횟수 증가 함수
function login(event) {
    event.preventDefault(); // 폼 제출 이벤트의 기본 동작 중단
    const failedLoginCount = getFailedLoginCount(); // 현재 로그인 실패 횟수를 가져옴

    // 로그인 실패 횟수가 3회 이상일 경우
    if (failedLoginCount >= 3) {
        const lockTime = getCookie("lockTime"); // 잠금 시간 쿠키를 가져옴
        if (lockTime) {
            const currentTime = new Date().getTime(); // 현재 시간을 가져옴
            if (currentTime < lockTime) { // 현재 시간이 잠금 시간보다 작으면
                const remainingTime = Math.ceil((lockTime - currentTime) / 1000); // 남은 잠금 시간을 계산
                alert(`로그인을 ${failedLoginCount}번 실패했습니다. ${remainingTime}초 동안 로그인이 금지됩니다.`);
                return;
            } else {
                setFailedLoginCount(0); // 3분이 지나면 로그인 실패 횟수 초기화
            }
        }
    }
    checkInput(event); // 입력값 검증 함수 호출
}

// 로그인 정보 검증 및 처리 함수
function checkInput(event) {
    const loginForm = document.getElementById('login_form'); // 로그인 폼 요소
    const emailInput = document.getElementById('typeEmailX'); // 이메일 입력 요소
    const passwordInput = document.getElementById('typePasswordX'); // 비밀번호 입력 요소
    const idsave_check = document.getElementById('idSaveCheck'); // 아이디 저장 체크박스
    const emailValue = emailInput.value.trim(); // 이메일 입력값의 앞뒤 공백 제거
    const passwordValue = passwordInput.value.trim(); // 비밀번호 입력값의 앞뒤 공백 제거
    
    // 이메일 형식 검증
    const isEmailOK = emailValue.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) !== null;

    // 이메일 또는 비밀번호가 비어 있는 경우
    if (emailValue === '' || passwordValue === '') {
        alert('아이디와 비밀번호를 모두 입력해주세요');
        increaseFailedLoginCount(); // 로그인 실패 횟수 증가
        return;
    }

    // 이메일 형식이 올바르지 않은 경우
    if (!isEmailOK) {
        alert('이메일을 올바르게 입력하세요.');
        increaseFailedLoginCount(); // 로그인 실패 횟수 증가
        return;
    }

    // 이메일 길이가 25글자 초과인 경우
    if (emailValue.length > 25) {
        alert('이메일은 최대 25글자 이하로 입력해야 합니다.');
        increaseFailedLoginCount(); // 로그인 실패 횟수 증가
        return;
    }

    // 이메일 길이가 5글자 미만인 경우
    if (emailValue.length < 5) {
        alert('아이디는 최소 5글자 이상 입력해야 합니다.');
        increaseFailedLoginCount(); // 로그인 실패 횟수 증가
        return;
    }

    // 비밀번호 길이가 12글자 미만인 경우
    if (passwordValue.length < 12) {
        alert('비밀번호는 반드시 12글자 이상 입력해야 합니다.');
        increaseFailedLoginCount(); // 로그인 실패 횟수 증가
        return;
    }

    // 비밀번호에 특수문자가 포함되어 있지 않은 경우
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(passwordValue);
    if (!hasSpecialChar) {
        alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
        increaseFailedLoginCount(); // 로그인 실패 횟수 증가
        return;
    }

    // 비밀번호에 대문자와 소문자가 포함되어 있지 않은 경우
    const hasUpperCase = /[A-Z]/.test(passwordValue);
    const hasLowerCase = /[a-z]/.test(passwordValue);
    if (!hasUpperCase || !hasLowerCase) {
        alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
        increaseFailedLoginCount(); // 로그인 실패 횟수 증가
        return;
    }

    // XSS 체크
    const sanitizedEmail = checkXSS(emailValue); // 이메일 입력값에서 XSS 위험 요소 제거
    const sanitizedPassword = checkXSS(passwordValue); // 비밀번호 입력값에서 XSS 위험 요소 제거
    if (!sanitizedEmail || !sanitizedPassword) {
        return; // XSS 위험이 있는 경우 처리 중단
    }

    // 아이디 저장 체크박스가 체크되어 있는 경우 쿠키에 저장
    if (idsave_check.checked) {
        setCookie("id", emailValue, 1); // 1일 동안 쿠키에 아이디 저장
    }

    // 세션 생성
    session_set();

    // 폼 제출
    loginForm.submit();
}

// 로그인 시도 횟수 증가 함수
function increaseFailedLoginCount() {
    var count = getFailedLoginCount() || 0; // 현재 로그인 실패 횟수를 가져오거나 기본값 0 설정
    count++;
    setCookie("failedLoginCount", count, 1); // 로그인 실패 횟수 쿠키에 저장

    // 로그인 실패 횟수가 3회 이상일 경우 잠금 시간 설정
    if (count >= 3) {
        const lockTime = new Date().getTime() + 3 * 60 * 1000; // 현재 시간으로부터 3분 후
        setCookie("lockTime", lockTime, 1); // 3분 잠금 쿠키 설정
    }
}

// 로그인 시도 횟수 가져오기 함수
function getFailedLoginCount() {
    return parseInt(getCookie("failedLoginCount")) || 0; // 쿠키에서 로그인 실패 횟수를 가져오거나 기본값 0 설정
}

// 로그인 시도 횟수 설정 함수
function setFailedLoginCount(count) {
    setCookie("failedLoginCount", count, 1); // 로그인 실패 횟수를 쿠키에 저장
}

// 로그인이 성공한 경우 초기화 함수
function init_logined() {
    if (sessionStorage) {
        decrypt_text(); // 복호화 함수 호출
    } else {
        alert("세션 스토리지 지원 x"); // 세션 스토리지를 지원하지 않는 경우 경고
    }
}

// 페이지 로딩 시 초기화 함수 호출
document.addEventListener("DOMContentLoaded", init); // 문서가 로드되면 init 함수 호출

// 로그인 버튼 클릭 시 로그인 처리
document.getElementById("login_btn").addEventListener('click', login); // 로그인 버튼 클릭 시 login 함수 호출
