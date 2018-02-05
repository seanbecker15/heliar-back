let body_style = document.body.style;
let sun = document.getElementById('sun');
let moon = document.getElementById('moon');

getWeatherData();

setInterval(function() {
    getWeatherData();
}, 1000)

function getWeatherData() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.sunrise-sunset.org/json?lat=40.425869&lng=-86.908066&formatted=0", false);
    xhr.onload = err => {
        let weather_json = JSON.parse(xhr.responseText);
        let sunrise = weather_json.results.sunrise;
        let sunset = weather_json.results.sunset;
        setBackground(sunrise, sunset);
    }
    xhr.send();
    if(xhr.status != 200) {
        return;
    }
}

function setBackground(sunrise_time, sunset_time) {
    let offset = 0;
    let time = new Date(Date.now() + offset); // Now
    let sunrise = new Date(sunrise_time);   // Today's sunrise. If time < sunrise, it is nighttime
    let sunset  = new Date(new Date(sunset_time) + 1000*60*60);    // Today's sunset. If time > sunset, it is nighttime
    let time_remaining;  // The closer to 0 this gets, the more opaque the filter should be (inversely proporitional)
    let shade_coeff;
    let background_color;
    let color_change_time = 1000 * 60 * 60 * 1.5;
    let sun_left;
    let moon_left;
    let sun_top, moon_top;
    if(time > sunset) {
        // Nighttime before midnight
        time_remaining = new Date(sunrise.getTime() + 1000 * 60 * 60 * 24) - time.getTime();  // Use (next day sunrise - current time)
        time_ellapsed = time - sunset;
        if(time_remaining < color_change_time) {
            shade_coeff = -(1 - Math.pow((color_change_time - time_remaining) / color_change_time, .85)); // as time_remaining goes to 0, shade_coeff should go to 0(white).
        } else {
            shade_coeff = -1;
        }
        background_color = shade("#2EB5E5", shade_coeff);
        body_style.backgroundColor = background_color;
        if(shade_coeff > -0.5) {
            body_style.color = "black";
        } else {
            body_style.color = "white";
        }
        sun_left = -100 * time_remaining / (time_remaining + time_ellapsed);
        moon_left = 100 - 100 * time_remaining / (time_remaining + time_ellapsed);
        console.log(moon_left);
        sun.style.left = sun_left + "%";
        moon.style.left = moon_left + "%";
        if(time_remaining > time_ellapsed) {
            sun_top = 45 * (time_remaining - time_ellapsed) / time_remaining;      // Want 0 when time remaining == time ellapsed
            moon_top = 45 * (time_remaining - time_ellapsed) / time_remaining;
        } else {
            sun_top = 45 * (time_ellapsed - time_remaining) / time_ellapsed;
            moon_top = 45 * (time_ellapsed - time_remaining) / time_ellapsed;
        }
        sun.style.top = sun_top + "%";
        moon.style.top = moon_top + "%";
    } else if(time < sunrise) {
        // Nighttime after midnight
        time_remaining = sunrise - time;
        time_ellapsed = time - (sunset - 1000*60*60*24);  // (current time - last night's sunset time)
        if(time_remaining < color_change_time) {
            shade_coeff = -(1 - Math.pow((color_change_time - time_remaining) / color_change_time, .85)); 
        } else {
            shade_coeff = -1;
        }
        background_color = shade("#2EB5E5", shade_coeff); // if shade_coeff == -1, this is black. 0 == white.
        body_style.backgroundColor = background_color;
        if(shade_coeff > -0.5) {
            body_style.color = "black";
        } else {
            body_style.color = "white";
        }
        sun_left = -100 * time_remaining / (time_remaining + time_ellapsed);
        moon_left = 100-100 * time_remaining / (time_remaining + time_ellapsed);
        sun.style.left = sun_left + "%";
        moon.style.left = moon_left + "%";
        if(time_remaining > time_ellapsed) {
            sun_top = 45 * (time_remaining - time_ellapsed) / time_remaining;      // Want 0 when time remaining == time ellapsed
            moon_top = 45 * (time_remaining - time_ellapsed) / time_remaining;
        } else {
            sun_top = 45 * (time_ellapsed - time_remaining) / time_ellapsed;
            moon_top = 45 * (time_ellapsed - time_remaining) / time_ellapsed;
        }
        sun.style.top = sun_top + "%";
        moon.style.top = moon_top + "%";
        
    } else {
        // Daytime
        time_remaining = sunset - time;  // As this gets closer to 0, shading should get closer to 1
        time_ellapsed = time - sunrise;
        if(time_remaining < color_change_time) {
            shade_coeff = -Math.pow((color_change_time - time_remaining) / color_change_time, .85); 
        } else {
            shade_coeff = 0;
        }
        background_color = shade("#2EB5E5", shade_coeff);
        body_style.backgroundColor = background_color;
        body_style.color = "white";
        
        // Update sun and moon
        // Sun should be positive % across screen proportional to the time remaining
        sun_left = 100 - 100 * time_remaining / (time_remaining + time_ellapsed);
        moon_left = -100 * time_remaining / (time_remaining + time_ellapsed);
        sun.style.left = sun_left + "%";
        moon.style.left = moon_left + "%";
        // Upward trajectory
        if(time_remaining > time_ellapsed) {
            sun_top = 45 * Math.pow((time_remaining - time_ellapsed) / time_remaining, 2);      // Want 0 when time remaining == time ellapsed
            moon_top = 45 * (time_remaining - time_ellapsed) / time_remaining;
        } else {
            sun_top = 45 * (time_ellapsed - time_remaining) / time_ellapsed;
            moon_top = 45 * (time_ellapsed - time_remaining) / time_ellapsed;
        }
        sun.style.top = sun_top + "%";
        moon.style.top = moon_top + "%";
    }
}

function shade(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}








// Get time
// Get sunset/sunrise time at location (For now, keeping this a constant location) DONE
// Adjust background color according to sunset/sunrise
// Adjust sun/moon according to sunset/sunrise