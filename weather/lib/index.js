/* eslint-disable import/extensions */
import { Application } from "@hotwired/stimulus";

import WeatherLocation from "./controllers/weather_location_controller.js";

window.Stimulus = Application.start();

window.Stimulus.register("weather-location", WeatherLocation);
