// deze data zal vanuit een api moeten komen
var flight =
    {
        'id': 'TulipAir',
        "title": "Tulip air",
        "latitude": 48.864716,
        "longitude": 1
    };

var flightData = {
    'origen': {
        "id": "amsterdam",
        "title": "Amsterdam",
        "latitude": 52.3105386,
        "longitude": 4.7682744,
    },
    'destination':
        {
            "id": "madrid",
            "title": "Madrid",
            "latitude": 40.4167,
            "longitude": -3.7033
        },
}


var fromSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";
var toSVG = 'M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z';
var planeSVG = "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47";

drawMap();

function drawMap() {


    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create map instance
    var chart = am4core.create("flight_info_map", am4maps.MapChart);
    chart.geodata = am4geodata_worldLow;
    chart.projection = new am4maps.projections.Miller();
    chart.homeZoomLevel = 4;
    chart.homeGeoPoint = {
        latitude: flight.latitude,
        longitude: flight.longitude
    };

    chart.geodata = am4geodata_worldLow;
    // chart.template.fill = chart.colors.getIndex(3).lighten(0.5);

    // Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    polygonSeries.mapPolygons.template.fill = '#bcbcaf';
    polygonSeries.mapPolygons.template.nonScalingStroke = true;
    polygonSeries.exclude = ["AQ"];

    // Configure series
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    // polygonTemplate.fill = am4core.color("#74B266");

    // Add line bullets
    var cities = chart.series.push(new am4maps.MapImageSeries());
    cities.mapImages.template.nonScaling = true;

    var city = cities.mapImages.template.createChild(am4core.Circle);
    city.radius = 6;
    city.fill = '#00ff9b';
    city.strokeWidth = 2;
    city.stroke = am4core.color("#f3eeee");

    function addCity(coords, title) {
        var city = cities.mapImages.create();
        city.latitude = coords.latitude;
        city.longitude = coords.longitude;
        city.tooltipText = title;
        return city;
    }

    var origen = addCity({
        "latitude": flightData.origen.latitude,
        "longitude": flightData.origen.longitude
    }, flightData.origen.title);
    var destination = addCity({
        "latitude": flightData.destination.latitude,
        "longitude": flightData.destination.longitude
    }, flightData.destination.title);

    // Add lines
    var lineSeries = chart.series.push(new am4maps.MapArcSeries());
    lineSeries.mapLines.template.line.strokeWidth = 3;
    lineSeries.mapLines.template.line.strokeOpacity = 1;
    lineSeries.mapLines.template.line.stroke = '#2f292b';
    lineSeries.mapLines.template.line.nonScalingStroke = true;
    // lineSeries.mapLines.template.line.strokeDasharray = "1";
    lineSeries.zIndex = 10;

    var line = lineSeries.mapLines.create();
    line.imagesToConnect = [origen, destination];
    line.line.controlPointDistance = -0.1;

    // Add plane
    var plane = lineSeries.mapLines.getIndex(0).lineObjects.create();
    plane.position = 1;
    plane.width = 48;
    plane.height = 48;
    plane.latitude = flight.latitude;
    plane.longitude = flight.longitude;

    plane.adapter.add("scale", function (scale, target) {
        return 0.5 * (1 - (Math.abs(0.5 - target.position)));
    })

    var planeImage = plane.createChild(am4core.Sprite);
    planeImage.scale = 0.08;
    planeImage.horizontalCenter = "middle";
    planeImage.verticalCenter = "middle";
    planeImage.path = "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47";
    planeImage.fill = '#BC6C25';
    planeImage.strokeOpacity = 1;

    function goPlane() {
        plane.animate({
            from: 0,
            to: 1,
            property: "position"
        }, 20000, am4core.ease.sinInOut);
    }

    goPlane();
}
