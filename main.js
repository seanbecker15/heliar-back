let body_style = document.body.style;

getWeatherData();

setInterval(function() {
    getWeatherData();
}, 10000)

function getWeatherData() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.sunrise-sunset.org/json?lat=40.425869&lng=-86.908066&formatted=0", false);
    xhr.send();
    if(xhr.status != 200) {
        return;
    }
    let weather_json = JSON.parse(xhr.responseText);
    let sunrise = weather_json.results.sunrise;
    let sunset = weather_json.results.sunset;
    setBackground(sunrise, sunset);
}

function setBackground(sunrise_time, sunset_time) {
    let time = new Date(Date.now() + 1000*60*60*6); // Now
    let sunrise = new Date(sunrise_time);   // Today's sunrise. If time < sunrise, it is nighttime
    let sunset  = new Date(new Date(sunset_time) + 1000*60*60);    // Today's sunset. If time > sunset, it is nighttime
    let filter_multiplier;  // The closer to 0 this gets, the more opaque the filter should be (inversely proporitional)
    let shade_coeff;
    let background_color;
    if(time > sunset) {
        // Nighttime before midnight
        console.log('night time before midnight');
        filter_multiplier = new Date(sunrise.getTime() + 1000 * 60 * 60 * 24) - time.getTime();  // Use next day sunrise - current time
        body_style.backgroundColor = "black";
    } else if(time < sunrise) {
        // Nighttime after midnight
        console.log('night time after midnight');
        filter_multiplier = sunrise - time;
        body_style.backgroundColor = "black";
    } else {
        // Daytime
        console.log('day time');
        filter_multiplier = sunset - time;  // As this gets closer to 0, shading should get closer to 1
        time_ellapsed = time - sunrise;
        if(time_ellapsed > filter_multiplier) {
            shade_coeff = -((time_ellapsed - Math.pow(filter_multiplier, 1.2)) / time_ellapsed);
        } else {
            shade_coeff = 0;
        }
        background_color = shade("#ffffff", shade_coeff);
        body_style.backgroundColor = background_color;
    }
    console.log(filter_multiplier);
    

    // if it's nighttime, base should be black and put white filter over
    // if it's daytime, base should be white and put black filter over
}

function shade(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}








// Get time
// Get sunset/sunrise time at location (For now, keeping this a constant location) DONE
// Adjust background color according to sunset/sunrise
// Adjust sun/moon according to sunset/sunrise