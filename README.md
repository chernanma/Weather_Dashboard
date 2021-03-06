# Homework06 Server-Side APIs: Weather Dashboard

This Weather Dashboard pulls current and 5 Day forecast weather information of a specific City which is entered by the user, all this data is pulled using a Third-party API.

The complete webpage has been developed using JQuery to manipulate the DOM make it dynamic, JQuery AJAX method to the make callout to the API, Bootstrap and Google Fonts for styling purposes.

[Click here to go to Weather Dashboard](https://chernanma.github.io/Weather_Dashboard/)

![picture](./Assets/images/main.jpg)

---

## How to use 

- Enter the name of the City that you would like to get weather information from 
- Click on the magnifier glass icon 
- Current and 5 Days forecast info will be displayed
- City entered would be stored in user local storage, so the user can consult weather info for the most relevant cities for the user.

---
## Technologies

- JQuery
- JQuery AJAX
- Boostrap
- Google Fonts

## Code

``` JS
/**** script.js******/

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
    }
    // Cleanig Cities List 
    $('#cities').empty();
    //Calling loadCities function to load all cities from local storage into City list
    loadCities(Cities.length);

    $('#cities li').on('click',function(){
        $('.card-deck').empty();
      apiCallout($(this).text());
      
    });
    $('#searchInput').val('');
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
        iconurl="http://openweathermap.org/img/w/" + iconcode + ".png";
     
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
        queryForcast = "http://api.openweathermap.org/data/2.5/forecast?q="+cityName+"&appid="+apiKey;
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
                    var divIcon =$('<img>').attr('src','http://openweathermap.org/img/w/' + responseforcast.list[i].weather[0].icon + '.png');
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
}

//Calling callout function every time a city is chooce from Cities List
$('#cities li').on('click',function(){
    $('.card-deck').empty();
  apiCallout($(this).text());
  
});

```
---

## Screenshots


### Main Page


![picture](./Assets/images/main.jpg)

### Search Area

![picture](./Assets/images/search.jpg)

### Data Diplay Are

![picture](./Assets/images/data.jpg)

---
## References

- Bootstrap, https://getbootstrap.com/

- JQuery W3Schools, https://www.w3schools.com/jquery/

- Google Fonts, https://fonts.google.com/

- jQuery AJAX Methods https://www.w3schools.com/jquery/jquery_ref_ajax.asp