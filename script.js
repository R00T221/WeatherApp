// FETCHING USER TAB ELEMENT
const userTab=document.querySelector('[data-userWeather]');

//FETCHING SEARCH TAB ELEMENT
const searchTab=document.querySelector('[data-searchWeather]');

//FETCHING WEATHER CONTAINER
const userContainer=document.querySelector('.weather-container');

//FETCHING LOCATION ACCESS CONTAINER
const grantAccessContainer=document.querySelector('.grant-location-container');

//FETCHING FORM(ENTER CITY) CONTAINER
const searchForm=document.querySelector('[data-searchForm]');

//FETCHING LOADING SCREEN UI
const loadingScreen=document.querySelector('.loading-container');

//FETCHING USER-INFO-CONTAINER
const userInfoContainer=document.querySelector('.user-info-container');

//FETCHING 'GRANT ACCESS' BUTTON
const grantAccessButton = document.querySelector('[data-grantAccess]');

 //fetching an element which displays error message on UI
 let errContainer=document.querySelector('[error-cont]');
 let errMsg=document.querySelector('[data-error]');

 //FETCHING NETWORK ERROR IMAGES
 let notFound=document.querySelector('[error-notFound]');
 let noInternet=document.querySelector('[error-noInternet]');

//DEFINING API_KEY VARIABLE
let API_KEY='3f6dae9c94fb98baee512cc2f0ac44d1';



//DEFINING A VARIABLE FOR CURRENT TAB
let currentTab = userTab; //By default current tab will point to user tab which is user's weather info when the app opens.

//Adding a class to currentTab which contains properties of currentTab.This will be used when we want currentTab to hide,then we can remove this class from it.
currentTab.classList.add('current-tab');

//Calling the getFromSessionStorage() function once intially so that if the coordinates are already present,the current user weather will be displayed intially
getFromSessionStorage(); 

//Adding click event listener on user-tab for switching purpose
userTab.addEventListener('click',() =>{
  //Invoking a function which handles switching and passing the 'clicked tab' as parameter
  switchTab(userTab); 
});

//Adding click event listener on search-tab for switching purpose
searchTab.addEventListener('click',() =>{
    //Creating a function which handles switching and passing the 'clicked tab' as parameter
    switchTab(searchTab); 
  });

  //NOTE:-Current tab =OLd tab
//clicked Tab =New tab

  //CREATING switchTab FUNCTION
  function switchTab(clickedTab){
 //Now user can click on the same tab on which he is presently on which means that should not change the tab,so checking this condition.Since we want to change the tab on when current tab is not equal to clicked tab.
 if(clickedTab != currentTab){
 //Removing the grey background from current tab
 currentTab.classList.remove("current-tab");
 //Now current tab will be equal to clicked tab
 currentTab=clickedTab;
 //Since the current tab is now the new clicked tab,so adding background-color back to current tab
 currentTab.classList.add("current-tab");

 //Till now we added the background properties on current tab but we don't know which one is current tab becox to  display data about the current tab we need to know
 //Finding which tab is the current tab (Search City OR User Weather tab)
 if(!searchForm.classList.contains('active')){ //It means there is no active class in searchForm tab and thus this tab has been clicked and now needs to be displayed.Note that since i am using tailwind,so instead of adding/removing active class,i may add tailwind utility classes like flex etc directly.

  //Ist removing location tab
  grantAccessContainer.classList.remove('active');
  // grantAccessContainer.classList.remove('hidden');

  //Removing user weather tab
  userInfoContainer.classList.remove('active');

  //Removing error container
   errContainer.classList.remove('active');

  // noInternet.classList.add('hidden');
  // notFound.classList.add('hidden');

  //Displaying Search Weather tab details
  searchForm.classList.add('active');

 }

 else{
  //If we are already on Search Weather tab and we need to switch to user weather tab i:e 'active' class is already present in searchForm.

  //Removing active class from searchForm
  searchForm.classList.remove('active');

  //Removing active class from user tab becox user details needs to be hidden 
  userInfoContainer.classList.remove('active');

  //Removing error container
  errContainer.classList.remove('active');

  //To display current weather of user location,we here call a function which uses location parameters from the local session to display current weather.Here in this function we check local storage for coordinates
  getFromSessionStorage(); 
 }

 }

  }
//Defining getFromSessionStorage() function.
function getFromSessionStorage(){
  //check if coordinates are already present in session storage.
  const localCoordinates=sessionStorage.getItem('user-coordinates'); //getItem() is method used to fetch from sessionStorage which is default directory used by JS.

  //If local coordinates are not there,means there is no location access and we need to display the location access container in order get location access.
  
  if(!localCoordinates){
    grantAccessContainer.classList.add('active');
  }
  else{
    //If local coordinates are there,then we use the longitude and latitude and call the API to fetch the weather details
    const coordinates=JSON.parse(localCoordinates);//converting the local coordinates into json object becox When we store data in sessionStorage using sessionStorage.setItem, the data is stored as strings. When we retrieve this data using sessionStorage.getItem, it returns the data as a string,so we needed to parse it.

    /* The main difference b/w JSON.parse and .json() is that JSON.parse converts json string into json object and .json() converts/extracts JSON data from a network request's response */ 

    //Calling a function which fetches user weather info
    fetchUserWeatherInfo(coordinates);
  }

}

//Defining fetchUserWeatherInfo() function,Since it includes API call,so using async-await.
async function fetchUserWeatherInfo(coordinates){
  const {lat,lon}=coordinates;
  /*NOTE:-SHORT FORM OF 
  const lat = coordinates.lat;
const lon = coordinates.lon;
IS:
const { lat, lon } = coordinates;
*/

//Hiding the grant location screen
grantAccessContainer.classList.remove('active');

//Removing error container
errContainer.classList.remove('active');


//Displaying the loading screen while we fetch the data using API
loadingScreen.classList.add('active');
  
//API CALL
try{
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

    if (!response.ok) {
      // Handle HTTP errors
      const errorMessage =response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
    }

    const data=await response.json();

  //HIDIDNG LOADING SCREEN NOW
  loadingScreen.classList.remove('active');

  //Displaying weather info fetched using longitude and latitude using user-info-container
  userInfoContainer.classList.add('active');

//Calling a function that will render info on UI within user-info-container.Since right now the user-info-screen is active and visible,so we need to display the data related to user-info
renderWeatherInfo(data);
}

catch(err){
  //Removing loading screen and displaying error
  loadingScreen.classList.remove('active');

 errContainer.classList.add('active');
 
  

  if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
    // Handle network errors
    console.error('Network error:', err);
    errMsg.textContent='NETWORK ERROR!!';
    //Removing hidden class from image
    noInternet.classList.remove('hidden');
  
    
  }
   else if(err.message.includes('404')){
    console.error('CITY NOT FOUND');
    errMsg.textContent='CITY NOT FOUND!!';
    notFound.classList.remove('hidden');
   }
  else {
    // Handle other errors
    console.error('Error while fetching:', err);
    errMsg.textContent='ERROR WHILE FETCHING--!';
  }
}
  }


 //DEFINING renderWeatherInfo function
function renderWeatherInfo(weatherInfo){
  //Ist we have to fetch elements in which we can put the weather data and display then on UI

//Fetching City Name...
let cityName=document.querySelector('[data-cityName');

//Fetching country icon
let countryIcon=document.querySelector('[data-countryIcon');

//Fetching weather description
let desc=document.querySelector('[data-weatherDesc]');

//Fetching WeatherIcon
let weatherIcon=document.querySelector('[data-weatherIcon]');

//Fetching Temprature
let temp=document.querySelector('[data-temp]');

//Fetching Windspeed
let windspeed=document.querySelector('[data-windspeed]');

//Fetching Humidity
let humidity=document.querySelector('[data-humidity]');

//Fetching Cloud Details
let cloudiness=document.querySelector('[data-cloudiness]');

//NOW FETCHING VALUES FROM weatherInfo object AND PUTTING THEM INTO THE RESPECTIVE UI elements.

/*==========================================
      OPTIONAL CHAINING OPERATOR (?.)
  ==========================================

  The optional chaining operator (?.) in JavaScript is a feature introduced in ECMAScript 2020 (ES11) that provides a concise way to access properties of an object in a nested enviroment without the need to check if each level of nesting exists. It simplifies the process of handling potentially undefined or null values within nested object structures.Usually when we access any method or attribute in a nested enviroment using a 'dot' operator and if the particular attribute/method/value is not present,we get an error but in case of optional chaining  operator,we get 'undefined' and not an error.

  We use the optional chaining operator (?.) immediately after the object or array reference, followed by the property or method you want to access. If the property or method exists, its value is returned; otherwise, undefined is returned.
  e:g:-

  const obj = {
    foo: {
        bar: {
            baz: 42
        }
    }
};
Without optional chaining:-

const bazWithoutOptionalChaining = obj.foo.bar.baz; 
This may throw an error if any intermediate property is null or undefined

With optional chaining:-
const bazWithOptionalChaining = obj.foo?.bar?.baz; 
Returns 42, or undefined if any intermediate property is null or undefined
*/

//FETCHING VALUE OF CITY NAME....City name is inside the 'name' child(string) of weatherInfo object.To know what is the child name that contains that specific property got to the API link using browser and see the details
cityName.innerText=weatherInfo?.name;

//FETCHING VALUE OF COUNTRY ICON.Using CDN link to convert country code (like IN,PK,US,CAN) into country flag by converting the codes into lower case.Since countryIcon is an image,so we will be using 'src' attribute.The country code is in 'sys' child of weatherInfo object.
countryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

//FETCHING DESCRIPTION OF WEATHER....Description is within the weather array of weatherInfo  object and is within the ist element.
desc.innerText=weatherInfo?.weather?.[0]?.description;

//FETCHING WEATHER ICON VALUE using a link
weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

//FETCHING TEMPRATURE...Temprature is within the nested 'main' object of weatherInfo object.Using template literal so that we could display °C.
temp.innerText=`${weatherInfo?.main?.temp} °C`;

//FETCHING WINDSPEED VALUE...It is within 'wind' nested object.
windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;

//FETCHING HUMIDITY VALUE
humidity.innerText=`${weatherInfo?.main?.humidity} %`;

//FETCHING CLOUD DETAILS
cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}

//APPLYING EVENT LISTENER ON 'GRANT ACCESS' BUTTON WHICH WILL DO 2 THINGS,FETCH THE CURRENT LONGITUDE AND LATITUDE USING GEOLOCATION API AND THEN STORE THEM IN SESSION STORAGE.
grantAccessButton.addEventListener('click',getLocation);

//DEFINING getLocation() CALL BACK FUNCTION
function getLocation(){
  
  //Checking if geolocation support is available
  if(navigator.geolocation){
    //If present,then use geolocation API  to fetch coordinates
    navigator.geolocation.getCurrentPosition(showPosition);
    /*Here we are using a callback function/method showPosition() to fetch coordinates.This method automatically takes 'position' object as argument.The position object contains information about the current position obtained from the geolocation API.The position object is provided by GeoLocation API.

    The position object is an instance of the GeolocationPosition interface, which is part of the Geolocation API. This interface has several properties, including coords, timestamp, and accuracy. Among these properties, coords is an object that contains information about the geographic coordinates of the device.

The coords object has properties such as latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, and speed. In this code, position.coords.latitude and position.coords.longitude are used to access the latitude and longitude of the current position, respectively.

    */
  }
  else{
    alert('Geo Location Not Supported By Your Browser!!!');
  }
}

//DEFINING showPosition(position) function/method..
function showPosition(position){
  //Creating an object which will contain latitude and longitude
  const userCoordinates={
    lat:position.coords.latitude,
    lon:position.coords.longitude,
  }

  //Storing coordinates in session storage.Since when we tried to fetch coordinates in getFromSessionStorage() function,we used the variable name(key) to retrieve coordinates as user-coordinates ,we need to set the coordinates in session storage under the same name(key) so that they are properly retrieved.We also need to convert the userCoordinates object to a string and then store it in session storage(local storage)
  sessionStorage.setItem('user-coordinates',JSON.stringify(userCoordinates));

  //Now since the coordinates are stored,we need to call function which fetches it and then displays it on UI.Here we call fetchUserWeatherInfo() which fetches the coordinates but it itself uses another function renderWeatherInfo() which displays it.Here we passed object(userCoordinates) to it,we can also call getFromSessionStorage() function here and pass the string version of userCoordinates object.This function inturn calls the fetchUserWeather() again.
  fetchUserWeatherInfo(userCoordinates);

}

//FETCHING ELEMENT FOR SEARCH INPUT
let searchInput=document.querySelector('[data-searchInput]');


//ADDING EVENT LISTENER ON SEARCH INPUT.When user clicks on search button,it will take city as input,then we call API and use reneder function to display data.
searchForm.addEventListener('submit',(e)=>{
 //'e' represents event object,here we need to use event object rather than callback becox we need to change the default property of the event.
 
 //Changing default property of submit event here and creating our own handling
  e.preventDefault();
   let cityName=searchInput.value
  if(cityName==="")//means no city name given by user as input
  return;
  else{
    //If search input given, call a function to fetch data using API and pass the input city as parameter.
    fetchSearchWeatherInfo(cityName);
  }
});


//DEFINING fetchSearchWeatherInfo function
async function fetchSearchWeatherInfo(city){
//Before fetching from API,activate the loader screen and remove the screen showing user weather info and grant location access
loadingScreen.classList.add('active');
userInfoContainer.classList.remove('active');
grantAccessContainer.classList.remove('active');
errContainer.classList.remove('active');

//CALLING API
try{
 
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  )

  
  
    if (!response.ok) {
      // Handle HTTP errors
      const errorMessage =response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
    }

  const data = await response.json();

  //Removing loader
  loadingScreen.classList.remove('active');

  //Displaying weather details.For that we need to display user-weather container and call render function to display data.
  userInfoContainer.classList.add('active');
  renderWeatherInfo(data);
}

catch(err){
  //Removing loading screen and displaying error
 loadingScreen.classList.remove('active');

 errContainer.classList.add('active');
 
  

  if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
    // Handle network errors
    console.error('Network error:', err);
    errMsg.textContent='NETWORK ERROR!!';
    noInternet.classList.remove('hidden');
    
  }
   else if(err.message.includes('404')){
    console.error('CITY NOT FOUND');
    errMsg.textContent='CITY NOT FOUND!!';
    notFound.classList.remove('hidden');
   }
  else {
    // Handle other errors
    console.error('Error while fetching:', err);
    errMsg.textContent='ERROR WHILE FETCHING--!';
  }





  
  
  
}
}