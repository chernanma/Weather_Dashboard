
var Cities = []; // Array for cities entered 

$(document).ready(function(){

//On Click Event to start search
$('#search').on('click',function(){
    //Getting value entered in Search input
    var Input = $('#searchInput').val();
    var liEl = $('<li>'); // creating Li element to insert in html page
    
    //Condition to check if city name entered exist in list of cities searched previusly, to prevent having duplicates in list of cities
    if (jQuery.inArray( Input, Cities )=== -1){
        console.log(Input);
        Cities.push(Input); //Adding cities to array 
        console.log(Cities.length);
        localStorage.setItem('Cities',JSON.stringify(Cities));//Saving Cities to local storage
        
        // Adding attributes,and appending Li element to List of cities  
        liEl.text(Input); 
        liEl.attr('class','list-group-item list-group-item-action');
        liEl.attr('id',Cities.length);
        $("#cities").prepend(liEl);
        apiCallout(Input);

    }
    

});



});

// Function to load all Cities from local storage if there is any
function loadCities (numCities){
    if (numCities !== null){
        for(var k = 0; k < Cities.length;k++){
            var liEl = $('<li>'); // creating Li element to insert in html page
            liEl.text(Cities[k]); 
            liEl.attr('class','list-group-item list-group-item-action');
            liEl.attr('id',k+1);
            $("#cities").prepend(liEl);
        }
      }

}

function apiCallout (cityName){
    var apiKey = '4125da2ecdcd852c08efeec865a349a6';    
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+apiKey;
    console.log(queryURL);
    var temperature ;
    var humidity;
    var windspeed ;
    var lon ;
    var lat ;
    var uv;
    var iconcode ;
    var iconurl ; 
    var d = new Date();

    var month = d.getMonth()+1;
    var day = d.getDate();
    
    var date = d.getFullYear() + '/' +
        (month<10 ? '0' : '') + month + '/' +
        (day<10 ? '0' : '') + day;

    // First API callout to pull General data    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        temperature = 9/(5*(parseInt(response.main.temp) - 273)) + 32 ;
        humidity = response.main.humidity;
        windspeed = response.wind.speed;
        lon = response.coord.lon;
        lat = response.coord.lat;
        iconcode= response.weather[0].icon;
        iconurl="http://openweathermap.org/img/w/" + iconcode + ".png";
     
        $('#cityname').text(cityName+' '+date);
        $('.temperature').text('Temperature: '+temperature);
        $('.humidity').text('Humidity: '+humidity);
        $('.windspeed').text('Wind Speed: ' + windspeed);

        $("#cityheader").html(`<h4 class="card-title" id="cityname">${response.name+" "}${date+" "}<img id='wiconHeader' src=${iconurl}></h4>`);
     
         // Second API callout to pull Index UV value  
        queryUVURL = "https://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lon+"&appid="+apiKey; 
        console.log(queryUVURL);   
        $.ajax({
            url: queryUVURL,
            method: "GET"
        }).then(function(responseIndexUV){
            console.log(responseIndexUV);
            uv = responseIndexUV.value;
            console.log(uv);
            $('#uv').text(uv);
            if (uv < 3){
                backcolor='green';
            }else if(uv < 6){
                backcolor='yellow';
            }else if(uv<8){
                backcolor='orange';
            }else if(uv<11){
                backcolor='red';
            }else{
                backcolor='violet';
            }               
            
            $('#uv').css('background-color',backcolor);
        }); 
       
        
        
        }); 
             
        
}



if (localStorage.getItem("Cities") !== null){
    Cities=JSON.parse(localStorage.getItem("Cities"));
    loadCities(Cities.length);      
}

//Callin call out function every time a city is chooce from Cities List
$('#cities li').click(function(){
  apiCallout($(this).text());
});

