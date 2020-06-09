const body = document.querySelector("body");

function paintImage(imgnum){
    const image = new Image();
    image.src = `/images/${imgnum + 1}.jpg`;
    image.classList.add("bgImage");
    body.prepend(image);
}

function getRandom(){
    const number = Math.floor(Math.random() * 3);
    return number
}

function init(){
    const randomnumber = getRandom();
    paintImage(randomnumber);
}
