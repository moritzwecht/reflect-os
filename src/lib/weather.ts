export interface WeatherData {
    temperature: number;
    weatherCode: number;
    sunrise?: string;
    sunset?: string;
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=auto`
        );
        const data = await response.json();
        return {
            temperature: data.current.temperature_2m,
            weatherCode: data.current.weather_code,
            sunrise: data.daily.sunrise[0], // ISO 8601 string
            sunset: data.daily.sunset[0],   // ISO 8601 string
        };
    } catch (error) {
        console.error("Failed to fetch weather:", error);
        throw error;
    }
}


