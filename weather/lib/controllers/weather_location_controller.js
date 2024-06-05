import { Controller } from '@hotwired/stimulus';
const key = "";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function spotify(moodOfTheSky){
  const tokenRequest = {grant_type: 'client_credentials',
                        client_id: '',
                        client_secret: '',
  };
  const searchParams = new URLSearchParams(tokenRequest);

fetch("https://accounts.spotify.com/api/token",{
  method: "POST",
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  body: searchParams.toString()
  })
.then(reponse => reponse.json())
.then((data) => {
  fetch(`https://api.spotify.com/v1/search?query=${moodOfTheSky}&type=playlist`,{
      method: "GET",
      headers: {'Authorization': 'Bearer ' + data.access_token}
  })
  .then(reponse => reponse.json())
  .then((data) => {
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      const element = document.getElementById('embed-iframe');
      const options = {
          uri: `${data.playlists.items["0"].uri}`
        };
      const callback = (EmbedController) => {};
      IFrameAPI.createController(element, options, callback);
    };
  })
})
}

function sky(description) {
 if (description.includes("Clear")){
    document.body.style.background = 'url(https://img.freepik.com/free-vector/natural-landscape-background-video-conferencing_52683-45368.jpg?t=st=1716067653~exp=1716071253~hmac=ad0c59c5d519dfa05bf8cd37d8032c88e671597ff317c4b86bf9a116672124eb&w=2000)';
    spotify("sunny day");
    return `☀️ ${description}`
 }
 else if (description.includes("Few")){
    document.body.style.background = 'url(https://img.freepik.com/free-vector/sky-background-video-conferencing_23-2148639325.jpg?t=st=1716066726~exp=1716070326~hmac=8b76dea805d4c4811b6858ff5e3e3e1affe3fec2f7b17e589c78eb1434851d98&w=2000)';
    spotify("sunny day");
    return `⛅ ${description}`
 }
 else if (description.includes("rain" || "Rain")){
    document.body.style.background ='url(https://static.vecteezy.com/system/resources/previews/012/098/044/non_2x/illustration-of-heavy-rain-cloudy-weather-with-cartoon-animation-style-rainy-scenery-background-free-vector.jpg)'
    spotify("rainy day");
    return `🌧️ ${description}`
  }
  else if (description.includes("Thunderstorm")){
    document.body.style.background ='url(https://img.freepik.com/free-vector/dark-cloud-with-flash-lightening-rainfall_1017-32188.jpg?w=1800&t=st=1716272875~exp=1716273475~hmac=1faec6aede6f5f15075bb3101f9a2c0f39ff7ed550250c1cef76396a64de3054)'
    spotify("dark stormy");
    return `🌩️ ${description}`
  }
  else if (description.includes("Snow")){
    document.body.style.background ='url(https://img.freepik.com/free-vector/hand-drawn-winter-background_23-2148731868.jpg?w=2000&t=st=1716272935~exp=1716273535~hmac=73028338645a06a893af35e5d338a1b2fbbad931ed4cb89a876530fd57b5f1c4)'
    spotify("snow globe")
    return`🌨️ ${description}`
  }
  else if (description.includes("Mist")){
    document.body.style.background ='url(https://thumbs.dreamstime.com/b/dirt-road-foggy-forest-dull-weather-landscape-dirt-road-foggy-forest-dull-weather-cartoon-nature-landscape-road-going-228944304.jpg)'
    spotify("gloomy");
    return`🌫️ ${description}`
  }
  else {
    document.body.style.background = 'url(https://img.freepik.com/free-vector/horizontal-seamless-pattern-with-clouds_1284-52895.jpg?t=st=1716067366~exp=1716070966~hmac=6deda407e8fe36a9973e8aec41391203fa57e602747e164d48b1ad0a71608417&w=2000)';
    spotify("gloomy");
     return `☁️ ${description}`
  };
}


export default class extends Controller {
  static targets = ["input", "hide", "show", "city", "temperature", "main", "wind", "rain", "sunrise", "sunset", "icon", "time"];

  weather(location){
    console.log(location);

    this.temperatureTarget.innerText = `🌡️ ${Math.round(location.main.temp - 273.15)}°C`;
    this.windTarget.innerText = `🌬️ ${Math.round(location.wind.speed*3.6)} km/h`;
    const description = capitalizeFirstLetter(location.weather[0].description);
    this.mainTarget.innerText = sky(description);

    const sunrise = location.sys.sunrise*1000;
    let sunriseHour = ((new Date(sunrise).getHours() - 2) + (location.timezone/3600));
    sunriseHour >= 24 ? sunriseHour -= 24 : sunriseHour;
    this.sunriseTarget.innerText = `🌄 ${sunriseHour}:${new Date(sunrise).getMinutes()}`;

    const sunset = location.sys.sunset * 1000;
    let sunsetHour = ((new Date(sunset).getHours() - 2) + (location.timezone/3600));
    sunsetHour <= 0 ? sunsetHour += 24 : sunsetHour;
    this.sunsetTarget.innerText = `🌃 ${sunsetHour}:${new Date(sunset).getMinutes()}`;

    fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=NRQI3ATE8OB8&format=json&by=position&lat=${location.coord.lat}&lng=${location.coord.lon}`)
      .then(reponse => reponse.json())
      .then((currentTime) => {
        console.log(currentTime);
        const currentHour = new Date(currentTime.timestamp*1000).getHours() - 2;
        this.timeTarget.innerText = `Curent Time : ${currentHour}:${new Date(currentTime.timestamp*1000).getMinutes()}`;
      })
  }

  location(){
   event.preventDefault();
   fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${this.inputTarget.value}&appid=${key}`)
    .then(reponse => reponse.json())
    .then((data) =>{
      if (data.length === 0){
        console.log(this.inputTarget);
      }
      else{
        const lat = data[0].lat;
        const lon = data[0].lon;
        const name = data[0].name;
        this.cityTarget.innerText = name;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`)
        .then (reponse => reponse.json())
        .then((city) => {
          this.hideTarget.classList.add("d-none");
          this.showTarget.classList.remove("d-none");
          this.weather(city);
        });
      };
    });
  }

  new(){
    this.hideTarget.classList.remove("d-none");
    this.showTarget.classList.add("d-none");
  }
}
