
var angular = require("angular")
// require("angular-material")
// require("angular-ui-router")

// require("!style-loader!css-loader!angular-material/angular-material.css")

//require("!style-loader!css-loader!../css/flossing-tracker.css")

var colormap = require('colormap')

var colors = colormap({
    colormap: 'rainbow',
    nshades: 256,
    format: 'hex',
    alpha: 1
})

var app = angular.module("FlossingTrackerApp", [])

function Tracker(name) {
    this.name = name
    this.style = {}
    
    this.pastTime = function () {
        return new Date(new Date().getTime() - 48 * 3600 * 1000).getTime();
    };

    this.get_updateList = function (name) {
        try {
            if (!localStorage[this.name]) {
                return [];
            }
            if (localStorage[this.name].indexOf("[") != 0) {
                return [];
            }
            var list = JSON.parse(localStorage[this.name]);
            if (list.length == 0) {
                return [];
            } else {
                return list;
            }
        } catch (error) {
            return [this.pastTime()];
        }
    }

    this.push_updateList = function (timestmap) {
        var list = this.get_updateList();
        console.log("push_updateList", list)
        list.push(timestmap);
        console.log("push_updateList", list)
        localStorage[this.name] = JSON.stringify(list);
    }

    this.pop_updateList = function (timestmap) {
        var list = this.get_updateList();
        console.log("pop_updateList", list);
        list.pop();
        console.log("pop_updateList", list);
        localStorage[this.name] = JSON.stringify(list);
    }


    this.tap = function () {
        let gracePeriode = 30;
        if (this.timeSinceLastFloss() > gracePeriode ||  this.timeSinceLastFloss() < 0) {
            this.push_updateList(new Date().getTime());
        } else {
            this.pop_updateList();
        }
        this.updateStyle();
    }

    this.get_lastUpdate = function () {
        var list = this.get_updateList();
        if (list.length == 0) {
            return new Date().getTime() + 10000;
        }
        return list[list.length - 1];
    }

    this.timeSinceLastFloss = function(){
        return (Date.now() - this.get_lastUpdate())/1000
    }

    this.updateStyle = function(){
        var offset = 150

        var hours = this.timeSinceLastFloss() / 3600


        var scaleHours = 48;
        var scale = (colors.length - offset) / scaleHours;
        
        var acceleration = 1;//3600 / 10 * 24 //this is for testing to make it move faster

        hours = hours * acceleration;
        var color = "blue";

        if (hours >= 0) {
            hours = Math.max(0, hours - 6)

            var colorIndex = Math.min(colors.length - 1, offset + Math.floor(hours * scale )) 
            
            //console.log(new Date(), hours, colorIndex);

            color = colors[colorIndex]
           
        }
        

        this.style = {"background-color": color}
    }
}

app.controller("MainController", function($scope){
    $scope.trackers = [new Tracker('Nova'),new Tracker('Helena'),new Tracker('Peter')];

    $scope.tap = function(tracker){
        tracker.tap()
    }

    setInterval(function(){
        $scope.$apply(function(){
            $scope.trackers.forEach(function(tracker){
                tracker.updateStyle()
            });
        })
    },1)
})
