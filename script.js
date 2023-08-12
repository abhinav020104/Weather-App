const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const WeatherContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen  = document.querySelector(".loading-container");
const userInfo = document.querySelector(".userInfoContainer");

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
let currentTab = userTab;
currentTab.classList.add("current-tab");

userTab.addEventListener('click' , () => {
    switchTab(userTab);
}); 

searchTab.addEventListener('click' , () => {
    switchTab(searchTab);
});

getfromSessionStorage();

function getfromSessionStorage()
{
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        grantAccessContainer.classList.add("active");
    }
    else
    {
        console.log(localCoordinates);
        const coordinates =  JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
        // console.log(coordinatess);
    }
}

async function fetchUserWeatherInfo(coordinates)
{
    const {lat , lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data  = await response.json();
        loadingScreen.classList.remove("active");
        userInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(errr)
    {
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon =  document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon =  document.querySelector("[data-weatherIcon]");
    const temperature = document.querySelector("[data-temperature]");
    const windspeed =  document.querySelector("[data-windSpeed]");
    const humidity  = document.querySelector("[data-Humidity]");
    const cloudiness = document.querySelector("[data-Cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText =  weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText= `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}

function switchTab(clickedTab){
    if(clickedTab != currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active"))
        {
            userInfo.classList.remove("active");
            searchForm.classList.add("active");
            grantAccessContainer.classList.remove("active");        
        }    
        else
        {
            userInfo.classList.remove("active");
            getfromSessionStorage();
            searchForm.classList.remove("active");
        }
    }
}

function showPosition(position)
{
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        alert("No GeoLocation Support Available");
    }
}
const grantAccessButton =  document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click',getLocation);

let searchInput =  document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit" , (e)=> {
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === "")
    return;

    fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(cityName)
{
    loadingScreen.classList.add("active");
    userInfo.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`)
        const data =  await response.json();
        loadingScreen.classList.remove("active");
        userInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e)
    {
        alert("Cannot Fetch Weather");
    }
}