const size = 5, minecnt = 7;
const minemap = Array.from(Array(size), () => new Array(size));

const GetMineCnt = (y,x) => {
    
    let ret = 0;
    for(let i=y-1; i<=y+1; i++){
        for(let j=x-1; j<=x+1; j++){
            if(i<0 || j<0 || i>=size || j >= size) continue;
            if(minemap[i][j] == 1) ret++;
        }
    }
    return ret;
}

const getRandomInt = (min,max) =>{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

const Init = () =>{

    for(let i =0; i< size; i++){
        for(let j=0; j<size; j++){
            minemap[i][j] = getRandomInt(0,2);
        }
    }
}

Init();
console.log(minemap);
console.log(GetMineCnt(0,0));
