
var hamburger = document.querySelector('.toggle-button')






hamburger.addEventListener('click', function(){
    document.querySelector('nav').classList.toggle("active");
    document.querySelector('.fa-times-circle').classList.toggle("fa-bars");
});


document.querySelector('.footer-nav-toggle').addEventListener('click',function(){
document.querySelectorAll('nav')[1].classList.toggle("active");
document.querySelectorAll('.fa-times-circle')[1].classList.toggle("fa-bars");
});