
var Cities = []; // Array for cities entered 

$(document).ready(function(){

//On Click Event to start search
$('#search').on('click',function(){
       
        $('.card-deck').empty();
        //Getting value entered in Search input
        var Input = $('#searchInput').val();
        var liEl = $('<li>'); // creating Li element to insert in html page
        
        if ($('#searchInput').val() === ""){
            $('#cityname').text('City Info'); 
            // Clearing result when input is blank
            $('.temperature').text('Temperature: ');
            $('.humidity').text('Humidity: ');
            $('.windspeed').text('Wind Speed: ');
            $('.uvindex').text('UV Index: ');
            return;
                    
        }else{
            // Callout to validate if the city or any value entered by the user exists or is valid
            var apiKey = '4125da2ecdcd852c08efeec865a349a6';    
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+$('#searchInput').val()+"&appid="+apiKey;
            var status;
            $.ajax({
                url: queryURL,
                method: "GET",
            })    
                .done(function(){
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
                 // Clearing Cities List 
                $('#cities').empty();
                //Calling loadCities function to load all cities from local storage into City list
                loadCities(Cities.length);

                $('#cities li').on('click',function(){
                    $('.card-deck').empty();
                apiCallout($(this).text());
                
                });
                $('#searchInput').val('');
            })
        
            .fail(function(){
                
                alert('City was not found');
                $('#searchInput').val("");
            });
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
    // Initialazing variables
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
        console.log(response);// Debbuing purposes
        temperature = (9/5)*(parseInt(response.main.temp) - 273.15) + 32 ;
        humidity = response.main.humidity;
        windspeed = response.wind.speed;
        lon = response.coord.lon;
        lat = response.coord.lat;
        iconcode= response.weather[0].icon;
        iconurl="https://openweathermap.org/img/w/" + iconcode + ".png";
     
        //inserting values into html elements
        $('#cityname').text(cityName+' '+date);
        $('.temperature').text('Temperature: '+ parseInt(temperature) +' °F');
        $('.humidity').text('Humidity: '+humidity +' %');
        $('.windspeed').text('Wind Speed: ' + windspeed);

        $("#cityheader").html(`<h4 class="card-title" id="cityname">${response.name+" "}${date+" "}<img id='wiconHeader' src=${iconurl}></h4>`);
     
         // Second API callout to pull Index UV info  
        queryUVURL = "https://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lon+"&appid="+apiKey; 
        console.log(queryUVURL);   
        $.ajax({
            url: queryUVURL,
            method: "GET"
        }).then(function(responseIndexUV){
            console.log(responseIndexUV);
            uv = responseIndexUV.value;
            console.log(uv);
            //Condition to set background color base on UV Index value
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

        // Third API callout to pull 5 days forecast Data  
        queryForcast = "https://api.openweathermap.org/data/2.5/forecast?q="+cityName+"&appid="+apiKey;
        console.log(queryForcast);   
        $.ajax({
            url: queryForcast,
            method: "GET"
        }).then(function(responseforcast){
            console.log(responseforcast);
            console.log(responseforcast.list.length);
            // Looping array to pull data for 5 days forecast
            for (var i = 0;i < responseforcast.list.length;i++){
                if (i === 3 || i === 11 || i === 19 || i === 27 || i === 35){
                    // creating element and appending to card which will contains all forecast info
                    var cardEl = $('<div>').attr('class','card');
                    var cardBodyEl = $('<div>').attr('class','card-body');
                    $('.card-deck').append(cardEl);
                    cardEl.append(cardBodyEl);
                    var cardTitle = $('<h5>').attr('class','card-title'); 
                    var dateforecast =(responseforcast.list[i].dt_txt).substr(0,10);
                    console.log(dateforecast);
                    cardTitle.text(dateforecast);                    
                    cardBodyEl.append(cardTitle);
                    var divIcon =$('<img>').attr('src','https://openweathermap.org/img/w/' + responseforcast.list[i].weather[0].icon + '.png');
                    cardBodyEl.append(divIcon);
                    var ptempEl = $('<p>').attr('class','card-text dailytemperature').text('Temp: '+ parseInt((9/5)*(parseInt(responseforcast.list[i].main.temp) - 273) + 32)+' °F');   
                    cardBodyEl.append(ptempEl);
                    var pHumidity = $('<p>').attr('class','card-text dailytemperature').text('Humidity: '+ responseforcast.list[i].main.humidity +' %');
                    cardBodyEl.append(pHumidity);              
                
                }            

            }    
            
        });       
        
        });      
        
}

//Conditin to check if there are values in the local storage so can be loaded in the list of cities
if (localStorage.getItem("Cities") !== null){
    Cities=JSON.parse(localStorage.getItem("Cities"));
    loadCities(Cities.length);     
    apiCallout(Cities[Cities.length-1]); // Loading data for the last searched city     
}

//Calling callout function every time a city is chooce from Cities List
$('#cities li').on('click',function(){
    $('.card-deck').empty();
  apiCallout($(this).text());
  
});

