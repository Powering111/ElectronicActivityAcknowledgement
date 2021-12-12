const registerForm1 = document.getElementById("register_form1");
const registerForm2 = document.getElementById("register_form2");
const statusText1 = document.getElementById('register_status1');
const statusText2 = document.getElementById('register_status2');

registerForm1.addEventListener('submit',(e)=>{
    e.preventDefault();
    const id = document.getElementById('register_id').value;
    const password = document.getElementById('register_pw').value;
    const password_re = document.getElementById('register_pw_re').value;

    if(password!==password_re){
        fail1('비밀번호 불일치')
    }else{
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if(xhr.readyState==xhr.DONE){
                if(xhr.status==200){
                    if(xhr.responseText==='OK'){
                        registerForm1.style.display="none";
                        registerForm2.style.display="block";
                    }
                    else{
                        fail1(xhr.responseText);
                    }
                }
            }
            else if (xhr.readyState === xhr.LOADING) {
                statusText1.innerText="대기 중...";
                statusText1.style.color="yellow";
                statusText1.style.visibility="visible";
            }
            else if (xhr.readyState===xhr.OPENED||xhr.readyState===xhr.HEADERS_RECEIVED){}
            else{
                fail1('연결 오류');
            }
        }
        xhr.open('POST', '/check');
        xhr.setRequestHeader('Content-Type','application/json');
        try{
            xhr.send(JSON.stringify({
                id
            }));
        }
        catch(e){
            fail1('오류가 발생했습니다.');
        }

    }
});
registerForm2.addEventListener('submit',register);
function register(e){
    e.preventDefault();
    
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        if(xhr.readyState==xhr.DONE){
            if(xhr.status==200){
                if(xhr.responseText==='OK'){
                    statusText2.innerText="등록이 완료되었습니다!";
                    statusText2.style.color="green";
                    statusText2.style.visibility="visible";
                    setTimeout(()=>{
                        window.location.reload();
                    },1000);
                }
                else{
                    fail2(xhr.responseText);
                }
            }
        }
        else if (xhr.readyState === xhr.LOADING) {
            statusText2.innerText="대기 중...";
            statusText2.style.color="yellow";
            statusText2.style.visibility="visible";
        }
        else if (xhr.readyState===xhr.OPENED||xhr.readyState===xhr.HEADERS_RECEIVED){}
        else{
           fail2('연결 오류');
        }
    }
    xhr.open('POST', '/register');
    xhr.setRequestHeader('Content-Type','application/json');

    const id = document.getElementById('register_id').value;
    const password = document.getElementById('register_pw').value;
    const name = document.getElementById('register_name').value;
    const generation = document.getElementById('register_generation').value;
    const classnum = document.getElementById('register_classnum').value;

    try{
        xhr.send(JSON.stringify({
            id,password,name,generation,classnum
        }));
    }
    catch(e){
        fail1('오류가 발생했습니다.');
    }
}
function fail1(why){
    statusText1.innerText = why;
    statusText1.style.color="red";
    statusText1.style.visibility="visible";
}
function fail2(why){
    statusText2.innerText = why;
    statusText2.style.color="red";
    statusText2.style.visibility="visible";
}

function back(e){
    registerForm1.style.display="block";
    registerForm2.style.display="none";
}