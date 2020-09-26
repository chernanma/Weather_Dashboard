

function inserticonn(){
    var iconcode = '02d';
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    $('.wicon').attr('src', iconurl);
    console.log(iconurl);
}

inserticonn();
