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

    return{lat,lon,temp,feels_like,temp_min, temp_max,humidity,name,dt,country,sunrise,sunset,details,icon,speed}
}

const getFormattedWeatherData = async (searchParams) => {
      const getformattedCurrentWeather = await getWeatherData ("weather" , searchParams).then(formattedCurrentWeather)

    return formattedCurrentWeather
}

export default getFormattedWeatherData

