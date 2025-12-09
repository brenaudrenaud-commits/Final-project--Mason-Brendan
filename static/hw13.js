window.onload = function () {
    console.log("window.onload fired, calling loadYears()");
    loadYears();
};

function loadYears() {
    console.log("loadYears() starting...");

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        console.log("readyState:", xhttp.readyState, "status:", xhttp.status);
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            console.log("responseText from /api/years:", xhttp.responseText);

            var data = JSON.parse(xhttp.responseText);
            var years = data.years;

            var yearSel = document.getElementById("year");
            yearSel.innerHTML = "";

            for (var i = 0; i < years.length; i++) {
                var opt = document.createElement("option");
                opt.value = years[i];
                opt.text = years[i];
                yearSel.appendChild(opt);
            }

            // also clear the other dropdowns
            document.getElementById("make").innerHTML = "";
            document.getElementById("model").innerHTML = "";
        }
    };

    xhttp.open("GET", "/api/years", true);
    xhttp.send();
}

function onSelectYear(sel) {
    var year = sel.value;
    console.log("onSelectYear, year =", year);

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            console.log("responseText from /api/makes:", xhttp.responseText);

            var data = JSON.parse(xhttp.responseText);
            var makes = data.makes;

            var makeSel = document.getElementById("make");
            makeSel.innerHTML = "";

            for (var i = 0; i < makes.length; i++) {
                var opt = document.createElement("option");
                opt.value = makes[i];
                opt.text = makes[i];
                makeSel.appendChild(opt);
            }

            document.getElementById("model").innerHTML = "";
        }
    };

    xhttp.open("POST", "/api/makes", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ year: year }));
}

function onSelectMake(sel) {
    var make = sel.value;
    var year = document.getElementById("year").value;
    console.log("onSelectMake, year =", year, "make =", make);

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            console.log("responseText from /api/models:", xhttp.responseText);

            var data = JSON.parse(xhttp.responseText);
            var models = data.models;

            var modelSel = document.getElementById("model");
            modelSel.innerHTML = "";

            for (var i = 0; i < models.length; i++) {
                var opt = document.createElement("option");
                opt.value = models[i];
                opt.text = models[i];
                modelSel.appendChild(opt);
            }
        }
    };

    xhttp.open("POST", "/api/models", true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ year: year, make: make }));
}

function onSelectModel(sel) {
    var model = sel.value;
    var year = document.getElementById("year").value;
    var make = document.getElementById("make").value;

    var text = year + ": " + make + " " + model;
    console.log("onSelectModel:", text);

    document.getElementById("selection").innerHTML = text;

    var qrUrl = "https://image-charts.com/chart?chs=200x200&cht=qr&chl="
                + encodeURIComponent(text);
    document.getElementById("qr").src = qrUrl;
}
