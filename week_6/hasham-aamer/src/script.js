

$(document).ready(function(){


  var markers= [];
  var currentInfoWindow=null;
  var name=null;
  var address=null;
  var phone=null;
  var contentstring=null;

  $('#mybutton').click(function(){

    //getting the input on the city @ button ClickHandler
    var term=$('#myinput').val();

    //get the input on the food type
    var food_type=$('#foodtype').val();

    console.log(term);
    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      cache: false,
      url: 'https://api.foursquare.com/v2/venues/search?client_id=XUXLO0NUOU5C54RCWE2UXF50MHWEL52I1APLQVSMBQJDGFPX&client_secret=0BEDRXQL312RAUAK2M5ON35BLUWSBRNCQDQNKADJ5COXJ4VJ&v=20180212&venuePhotos=1&near='+term+'&query='+food_type,

      success: function(response) {
        console.log(response)
        var element=document.getElementById('foursquare-map')
        var options={
          zoom: 10,
          center: new google.maps.LatLng(response.response.geocode.feature.geometry.center.lat, response.response.geocode.feature.geometry.center.lng),
        }
        var map= new google.maps.Map(element,options)

        clearTheMap();
        //console.log(response.response.geocode.feature.geometry.center.lat);
        response.response.venues.forEach(function(venue) {
          var latLng=new google.maps.LatLng(venue.location.lat, venue.location.lng);
          var image = {
          url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',

        };
          var marker= new google.maps.Marker({
            map: map,
            position: latLng,
            animation: google.maps.Animation.DROP
          })
          markers.push(marker);

          //creating the content string based on the information available
          //if any bit of the information collected is null, nothing is returned or displayed

          contentstring=venue.name

          if(venue.location.address!=null)
          {
            contentstring+= '<br>'+ venue.location.address
          }

          if(venue.contact.formattedPhone!=null)
          {
            contentstring+= '<br>' + venue.contact.formattedPhone
          }

          if (venue.url!=null)
          {
            contentstring+= '<br>' + '<a href="' + venue.url + '" target="_blank">Website</a>'

          }

          var infowindow=new google.maps.InfoWindow({

                content: contentstring,
          })

          google.maps.event.addDomListener(marker,'click', function ClickHandler(){
            map.setCenter(marker.position)
            map.setZoom(12)
            if(currentInfoWindow!=null)
            {
              currentInfoWindow.close();
            }
            infowindow.open(map,marker)
            currentInfoWindow=infowindow;
          })

          google.maps.event.addDomListener(map,'click',function(){

            if(currentInfoWindow!=null)
            {
              currentInfoWindow.close();
            }

          })
        })
      }
    })
  })

function clearTheMap(){

  for (var i=0;i<markers.length;i++){

    markers[i].setMap(null);
  }
  markers=[];
}

})
