var mongoose = require("mongoose");
var spots = require("./models/spots");

var data = [
    {
        title : "Szentbékkála kőtenger",
        location : {
            address : "Szentbékkálla, Szentbékkállai kőtenger",
            lat : 46.8906538, 
            lng : 17.556248600000004 }, 
        image : "http://kirandulastippek.hu/images/news/article/zoom/p814-3.jpg", 
        description : "Magyarországon talán a legjobb hely triálra. A csak sziklából álló helyen gyorsan megtanulhatóak a technikás ugrások."
    },
    {
        title : "Győri triálpálya",
        location : {
            address : "Győr, Orgona utca",
            lat : 47.67138910000001, 
            lng : 17.631325100000026 }, 
        image : "http://www.kisalfold.hu/marcalvarosi_palya/cikk/235/2345311/4.jpg", 
        description : "Beton elemek, raklapokból álló pálya. Mind technikára, mind a nagyobb ugrások fejlődésére alkalmas pálya. Kontakt: Végh András."
    },
    {
        title : "Kapuvári triálpálya",
        location : {
            address : "Kapuvár, Keleti sor 30.",
            lat : 47.582520, 
            lng : 17.045190 }, 
        image : "http://gravitypark.ro/wp-content/uploads/2017/09/5-trial-gravity-park.jpg", 
        description : "Nagyon technikás kis pálya Soós Martintól és Mikitől. Raklapok, gumik, beton elemek... Kontakt:Martin és Miki."
    }
]

function seedDB(){

   spots.remove({}, function(err){
        if(err){
            console.log(err);
        }
        
        data.forEach(function(seed){
            spots.create(seed, function(err, spot){
                if(err){
                    console.log(err)
                } 
            });
        });
        
    });
    
}

module.exports = seedDB;