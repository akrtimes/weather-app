const yourLocTab = document.querySelector(".current-tab");
const searchLocTab = document.querySelector(".search-weather");
const whetherReportContainer = document.querySelector(".weather-report-container");
const searchBoxContainer = document.querySelector(".search-box-contaienr");
const searchBoxInput = document.getElementById("search-box");
const searchBoxSubmitBtn=document.getElementById("search-box-submit-btn");
const grantLoactionContainer = document.getElementById("grantLocationCont");
const loadingContainer = document.querySelector(".loading-container");
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
const grantAccessBtn = document.getElementById("grant-access-btn");
const cityNotFoundContainer=document.getElementsByClassName("city-not-found");


defaultScreen();
searchLocTab.addEventListener("click", () => {
    yourLocTab.classList.remove("tab-highlight");
    loadingContainer.classList.remove("active");
    cityNotFoundContainer[0].classList.remove("active");
    searchLocTab.classList.add("tab-highlight");
    whetherReportContainer.classList.remove("active");
    searchBoxContainer.classList.add("searc-box-active");
    grantLoactionContainer.classList.remove("active");
    searchBoxInput.value = "";

});
yourLocTab.addEventListener("click", defaultScreen);

function defaultScreen() {
    searchBoxContainer.classList.remove("searc-box-active");
    searchLocTab.classList.remove("tab-highlight");
    yourLocTab.classList.add("tab-highlight");

    getfromSessionStorage();

}
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantLoactionContainer.classList.add("active");
    } else {
        const cordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(cordinates);
    }
}
async function fetchUserWeatherInfo(cordinates) {
    const { lat, lon } = cordinates;
    grantLoactionContainer.classList.remove("active");
    loadingContainer.classList.add("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        renderWeatherInfo(data);
        loadingContainer.classList.remove("active");
        whetherReportContainer.classList.add("active");

        console.log(data);
    }
    catch (err) {
        loadingContainer.classList.remove("active");
    //    hw 
    }
}

let countryFlags=document.getElementById("country-flag");
let whetherTypeIcon=document.getElementById("weather-type-image");
function renderWeatherInfo(data) {
    const cityName = document.getElementById("city-name");
    const whetherType = document.getElementById("weather-type");
    const temp = document.getElementById("temprature");
    const windSpeed = document.getElementById("wind-speed");
    const humidity = document.getElementById("humidity");
    const clouds = document.getElementById("clouds");
    

    countryFlags.src=`https://flagcdn.com/16x12/${data?.sys?.country.toLowerCase()}.png`;
    
    whetherTypeIcon.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;


    temp.innerText = `${data?.main?.temp} °C`;
    cityName.innerText = data?.name;
    whetherType.innerText = data?.weather?.[0]?.description;
    windSpeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    clouds.innerText = `${data?.clouds?.all}%`;

}

grantAccessBtn.addEventListener("click", getLocation)

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        // hw show alert to ...
        alert("your browser does not support geo-location");
    }
}
function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


searchBoxContainer.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(searchBoxInput.value==="") 
        return;
    else
        fetchSearchWeatherInfo();
});
async function fetchSearchWeatherInfo(){
    loadingContainer.classList.add("active");
    searchBoxContainer.classList.remove("searc-box-active");
    // grantAccessContainer.classList.remove("active");
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${searchBoxInput.value}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        console.log("data" ,data);
        if(data?.message=="city not found")
        {
            // alert("city Not found");
            loadingContainer.classList.remove("active");
            cityNotFoundContainer[0].classList.add("active");
            return;
        }
        renderWeatherInfo(data);
        loadingContainer.classList.remove("active");
        whetherReportContainer.classList.add("active");
       
    }
    catch(err) {
       
        alert("search box not working ");
    }

}











