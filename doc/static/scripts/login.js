const loginForm = document.getElementById("login_form");
const statusText = document.getElementById('login_status');

loginForm.addEventListener('submit',login);
function login(e){
    e.preventDefault();
    
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        if(xhr.readyState==xhr.DONE){
            if(xhr.status==200){
                if(xhr.responseText==='OK'){
                    statusText.innerText="로그인 성공";
                    statusText.style.color="green";
                    statusText.style.visibility="visible";
                    setTimeout(()=>{
                        window.location.reload();
                    },1000);
                }
                else{
                    statusText.innerText=xhr.responseText;
                    statusText.style.color="red";
                    statusText.style.visibility="visible";
                }
            }
        }
        else if (xhr.readyState === xhr.LOADING) {
            console.log('loading');
            statusText.innerText="로그인 중...";
            statusText.style.color="yellow";
            statusText.style.visibility="visible";
        }
        else if (xhr.readyState===xhr.OPENED||xhr.readyState===xhr.HEADERS_RECEIVED){
        }
        else{
            console.log(xhr.readyState);
            statusText.innerText = "로그인 실패";
            statusText.style.color="red";
            statusText.style.visibility="visible";
        }
    }
    xhr.open('POST', '/authenticate');
    xhr.setRequestHeader('Content-Type','application/json');

    const id = document.getElementById('login_id').value;
    const pw = document.getElementById('login_pw').value;

    xhr.send(JSON.stringify({
        "id": id,
        "password": pw
    }));
}
