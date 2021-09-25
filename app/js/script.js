const burger = document.getElementById('hamburger');
const body = document.querySelector('body');
const signout = document.querySelectorAll('.signout');
const cancel = document.querySelector('#cancel');

burger.addEventListener('click',()=>{
    if(body.classList.contains('burger')){
        body.classList.remove('burger');
    }else{
        body.classList.add('burger');
        body.classList.remove('signout');
    }
});

signout.forEach(button => {
    button.addEventListener('click', ()=> {
        if(body.classList.contains('signout')){
            body.classList.remove('signout');
        } else {
            body.classList.add('signout');
            body.classList.remove('burger');
        }
    });
});

cancel.addEventListener('click', ()=> {
    if(body.classList.contains('signout')){
        body.classList.remove('signout');
    }
});