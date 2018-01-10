var socket = io();
function init() {
    var locate = document.getElementById("locate")

    locate.addEventListener('click',function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var lat = (position.coords.latitude)
                var long = (position.coords.longitude)
                $.ajax({url: "/spot",
                    success: function(result){
                        alert(result)
                    },
                    error: function(xhr,status,error) {
                        alert(error)
                    }
                });
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    })
}

init()