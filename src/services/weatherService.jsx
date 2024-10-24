import { getDefaultNormalizer } from "@testing-library/react";

const API_KEY ="b8496338c7b42f7821c2c832013f910a";
const BASE_URL ="https://api.openweathermap.org/data/2.5"

//https://api.openweathermap.org/data/2.5/onecall?lat=35.6895&lon=139.6917&exclude=current,minutely,alerts&appid=1fa9ff4126d95b8db54f3897a208e91c&units=metric


const getWeatherData =(infoType, searchParams) => {
    const url = new URL(BASE_URL + "/" + infoType);
    url.search =new URLSearchParams({...searchParams, appid:API_KEY}
        );
      
        return fetch(url).then((res) => res.json());
};

const formattedCurrentWeather =(data) => {
    const{
        cord:{lat,lon},
        main:{temp,feels_like,temp_min,temp_max,humidity},
        name,
        dt,
        sys:{country,sunrise,sunset},
        weather,
        wind:{speed}
    }=data

    const{main: details, icon} =weather [0]

    return{lat,lon,temp,feels_like,temp_min, temp_max,humidity,name,dt,country,sunrise,sunset,details,icon,speed};
};

const formattedForecastWeather =(data) =>{
    let { timezone,daily,hourly} = data;
    daily = daily.slice(1,6).map(d => {
        return {
            title: formatToLocalTime(d.dt, timezone, 'ccc')
            temp: d.temp.day
            icon: d.weather[0].icon
        }
    });

    hourly = hourly.slice(1,6).map(d => {
        return {
            title: formatToLocalTime(d.dt, timezone, 'hh:mm a')
            temp: d.temp.day
            icon: d.weather[0].icon
        }
    });

return {timezone, daily, hourly};  
};

const getFormattedWeatherData = async (searchParams) => {
      const getformattedCurrentWeather = await getWeatherData ("weather" , searchParams).then(formattedCurrentWeather);

      const {lat, lon}= formattedCurrentWeather

      const formattedForecastWeather = await getWeatherData('onecall',{ lat, lon,exclude: 'current,minutely,alerts', units: searchParams.units}).then(formattedForecastWeather)

    return{...formattedCurrentWeather, ...formattedForecastWeather};
};

const formatToLocalTime =(secs, zone, format = "cccc,dd LLL yyyy' | Local time: 'hh:mm a") =>DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode =(code) => `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;

export {formatToLocalTime, iconUrlFromCode};

