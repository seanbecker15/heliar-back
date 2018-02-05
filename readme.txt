#readme

Heliar-back (Stands for helio-lunar background) is a simple package that sets the html body background to light blue during the day and dark blue- well, pretty much black- at night.

You can also add a time-oriented sun and/or moon if you'd like! 
    Here's how:
        1. Add the following to your html body.
            <div class="sun" id="sun"></div>
            <div class="moon" id="moon"></div>
        2. Add the following to your stylesheet. Feel free to edit however you want!
            .sun { 
                position: absolute;
                margin: auto;  
                width:70px;
                height:70px;
                border-radius:50%;	
                background:white;
                opacity:0.7;			
                box-shadow: 0px 0px 20px 6px white;  
            }
            .moon { 
                position: absolute;
                background-image: url("moon.svg");
                margin: auto;  
                width:90px;
                height:90px;
            }
        3. Insert an image called "moon.svg" to the root directory (or whatever format you'd like, but be sure to change the moon class background-image to match!)
            3.5 Feel free to use my "moon.svg" image.
        4. Voilah! You should have a time-dependant background, sun, and moon that show up on your website!

Additional details:
    The sunrise and sunset is currently set to West Lafayette, IN.
    I decided to hard code this in because I don't want to ask the user for permission to use their location.
    Until I minify the javascript, the location is on line 13, so feel free to change that.
