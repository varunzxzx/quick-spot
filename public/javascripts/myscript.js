var socket = io();
var myID;
socket.on('take id', function(data){
    myID = data.id
    console.log(myID)
});
socket.on('located',function(data) {
    console.log(data)
    $("#location-add").text(data.location.formatted_address);
    $("#lat").text(data.lat)
    $("#long").text(data.long)
})
function init() {
    var locate = document.getElementById("locate")

    locate.addEventListener('click',function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var lat = (position.coords.latitude)
                var long = (position.coords.longitude)
                $.ajax({url: "/spot",
                    method: "POST",
                    data: {
                        id: myID,
                        lat: lat,
                        long: long
                    },
                    success: function(result){
                        console.log(result)
                        $('#hospital').text(result.name);
                        $('#address').text(result.address);
                        $('#time').text(result.duration);
                    },
                    error: function(xhr,status,error) {
                        alert("Something went wrong")
                    }
                });
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    })
}

init()