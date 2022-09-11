//My Color Pallette
//#EEC4BB Baby Pink
//#D83D51 Darker Pink
//#D53300 Dark Orange/Red
//#DF7628 Orange
//#E4A807 Golden Rod
//#EDC55A Light Yellow
//#8CEB99 Light Green
//#629E48 Medium Green
//#30482E Dark Green

/*

DONE:
Breakout UTM parameters
Breakout subdirectories 1 & 2
Add in charts for UTM parameters


To do

~~Cleaning things up
* make the fitler bar sticky
* Add a size limit
* Have a "light" version
* Hide things before generating
* Refresh when someone uploads a new file

~~Data
* Include clicks as impressions (change from impression to impression/click)
----> QA this is correct
* Add an option to sort the chart by value
* Change "time" to days (UTC for now)
* Add functionality for dynamic parameters
* Add a download button for customized chart

~~Overarching
* Build out questions to answer
---> How many conversions are there per person?
---> What is the average time to conversion?
---> What is the average number of touchpoints per conversion?
---> Which campaign/ad group/device type/site drives the highest percent of conversions by each UTM source?

~~~Cool extra visuals
* Order of events on site



 */

let allHeaders = ['Partner ID', 'Advertiser ID', 'Conversion Time', 'Conversion Time UTC', 'Tracking Tag ID', 'Tracking Tag Name', 'Conversion ID', 'TDID', 'Conversion Device Type', 'Conversion Referrer URL', 'Cross Device Attribution Model', 'First Impression Time', 'First Impression Time UTC', 'First Impression Campaign Id', 'First Impression Campaign Name', 'First Impression Ad Group Id', 'First Impression Ad Group Name', 'First Impression Ad Format', 'First Impression Creative Id', 'First Impression Creative Name', 'First Impression Device Type', 'First Impression Ad Environment', 'First Display Click Time', 'First Display Click Time UTC', 'First Display Click Campaign Id', 'First Display Click Campaign Name', 'First Display Click Ad Group Id', 'First Display Click Ad Group Name', 'First Display Click Ad Format', 'First Display Click Creative Id', 'First Display Click Creative Name', 'First Display Click Device Type', 'First Display Click Ad Environment', 'Last Impression Time', 'Last Impression Time UTC', 'Last Impression Campaign Id', 'Last Impression Campaign Name', 'Last Impression Ad Group Id', 'Last Impression Ad Group Name', 'Last Impression Ad Format', 'Last Impression Creative Id', 'Last Impression Creative Name', 'Last Impression Device Type', 'Last Impression Ad Environment', 'Last Impression Country', 'Last Impression Metro Name', 'Last Impression Region', 'Last Impression Site', 'Last Display Click Time', 'Last Display Click Time UTC', 'Last Display Click Campaign Id', 'Last Display Click Campaign Name', 'Last Display Click Ad Group Id', 'Last Display Click Ad Group Name', 'Last Display Click Ad Format', 'Last Display Click Creative Id', 'Last Display Click Creative Name', 'Last Display Click Device Type', 'Last Display Click Ad Environment', 'Monetary Value Currency', 'Order Id', 'TD1', 'TD2', 'TD3', 'TD4', 'TD5', 'TD6', 'TD7', 'TD8', 'TD9', 'TD10', 'Impression Count', 'Display Click Count', 'Monetary Value']
let breakdownHeaders = ['Partner ID', 'Advertiser ID', 'Conversion Time', 'Conversion Time UTC', 'Tracking Tag ID', 'Tracking Tag Name', 'Conversion ID', 'TDID', 'Conversion Device Type', 'Conversion Referrer URL', 'Cross Device Attribution Model', 'First Impression Time', 'First Impression Time UTC', 'First Impression Campaign Id', 'First Impression Campaign Name', 'First Impression Ad Group Id', 'First Impression Ad Group Name', 'First Impression Ad Format', 'First Impression Creative Id', 'First Impression Creative Name', 'First Impression Device Type', 'First Impression Ad Environment', 'First Display Click Time', 'First Display Click Time UTC', 'First Display Click Campaign Id', 'First Display Click Campaign Name', 'First Display Click Ad Group Id', 'First Display Click Ad Group Name', 'First Display Click Ad Format', 'First Display Click Creative Id', 'First Display Click Creative Name', 'First Display Click Device Type', 'First Display Click Ad Environment', 'Last Impression Time', 'Last Impression Time UTC', 'Last Impression Campaign Id', 'Last Impression Campaign Name', 'Last Impression Ad Group Id', 'Last Impression Ad Group Name', 'Last Impression Ad Format', 'Last Impression Creative Id', 'Last Impression Creative Name', 'Last Impression Device Type', 'Last Impression Ad Environment', 'Last Impression Country', 'Last Impression Metro Name', 'Last Impression Region', 'Last Impression Site', 'Last Display Click Time', 'Last Display Click Time UTC', 'Last Display Click Campaign Id', 'Last Display Click Campaign Name', 'Last Display Click Ad Group Id', 'Last Display Click Ad Group Name', 'Last Display Click Ad Format', 'Last Display Click Creative Id', 'Last Display Click Creative Name', 'Last Display Click Device Type', 'Last Display Click Ad Environment', 'Monetary Value Currency', 'Order Id', 'TD1', 'TD2', 'TD3', 'TD4', 'TD5', 'TD6', 'TD7', 'TD8', 'TD9', 'TD10', 'Impression Count', 'Display Click Count', 'Monetary Value']
let breakdown = "Last Impression Campaign Name" 
let object = [];
let filteredBreakdown = "First Impression Campaign Name"
let filterValueArray = []
let myCharts = {}
for (let i = 0; i<document.getElementsByClassName('chart').length; i++){
    myCharts[document.getElementsByClassName('chart')[i].id] = null
    console.log(document.getElementsByClassName('chart')[i].id)
}

// let filterValueArray = listValuesOfABreakdown(originalObject, filteredBreakdown) //placeholder (doesn't filter)


//---Step 1: Upload conversion details data---
const reader = new FileReader()
function read(input) {
    const csv = input.files[0]
    reader.readAsText(csv)
    document.getElementById("file-selector").classList.add('hide')
    document.getElementById('filter-by-container').classList.remove('hide')
    document.getElementById('filter-by-container').classList.add('show')
}

function csvtoObjectPromise() {
    return new Promise((resolve, reject) => {
        reader.onload = function (e) {
        let strData = e.target.result
        object = $.csv.toObjects(strData)
        console.log(object)
        console.log("object done")
        resolve(object)
        }
    })
}

// --- Step 2: Allow Filters --

function getFilteredObject(object, filteredBreakdown, filterValueArray){
    let filteredObject = new Object
    if(filterValueArray.length > 0 ){filteredObject = object.filter(e => filterValueArray.indexOf(e[filteredBreakdown]) > -1)}
    else {filteredObject = object}
    return(filteredObject)
}

// ---Step 3: Perform calculations---

//get unique values for breakdowns
function listValuesOfABreakdown(object, breakdown){ //lists all unique values fr any breakdowns (i.e. all campaign names, ad groups)
    let uniqueValuesOfBreakdown = object.map(object => object[breakdown])
    .filter((value, index, self) => self.indexOf(value) === index)
    return uniqueValuesOfBreakdown
}

// ---Step3a: Totals---

//total converions count
function getTotalConversions(object, breakdown){
    let totalConversions = []
    if (breakdown == null){totalConversions.push(object.length)}
    else{
        listValuesOfABreakdown(object, breakdown).forEach(element => {
            let result = object.filter(e => e[breakdown] == element)
            totalConversions.push(result.length)
        });
    }
    return totalConversions  
}

//unique converters count
function getUniqueConverters(object, breakdown){
    let totalConverters = []
    if (breakdown == null){totalConverters.push(listValuesOfABreakdown(object, "TDID").length)}
    else{
        listValuesOfABreakdown(object, breakdown).forEach(element => {
            let result = object.filter(e => e[breakdown] == element)
            totalConverters.push(listValuesOfABreakdown(result, "TDID").length)
        });
    }
    return totalConverters  
    }

//total impressions count
function getTotalImpressions(object, breakdown){
    let totalImpressions = []
    let impressions = 0
    if (breakdown == null){
        object.forEach(e => {
            //impressions = impressions + parseInt(e["Impression Count"], 10)
            impressions = impressions + parseInt(e["Touch Count"], 10)
        })
        totalImpressions.push(impressions)
        }
        else{
            listValuesOfABreakdown(object, breakdown).forEach(element => {
                impressions = 0
                let result = object.filter(e => e[breakdown] == element)
                result.forEach(e => {
                    //impressions = impressions + parseInt(e["Impression Count"], 10)
                    impressions = impressions + parseInt(e["Touch Count"], 10)
                })
                totalImpressions.push(impressions)
            });
        }
        return totalImpressions  
    }

//average time between impressions
function getTimeBetweenImpressions(object, breakdown){
    let timeBetweenImpressions = []
    let avgTimeBetweenImpMS = 0
    let avgTimeBetweenImpDays = 0
    let impressions = 0
    let timeBetweenFandL = 0
    if (breakdown == null){
        object.forEach(e => {
            //impressions = impressions + parseInt(e["Impression Count"], 10)
            impressions = impressions + parseInt(e["Touch Count"], 10)
            //timeBetweenFandL = timeBetweenFandL + Date.parse(e["Last Impression Time UTC"]) - Date.parse(e["First Impression Time UTC"])
            timeBetweenFandL = timeBetweenFandL + Date.parse(e["Last Touch Time UTC"]) - Date.parse(e["First Touch Time UTC"])
        })
        avgTimeBetweenImpMS = timeBetweenFandL/impressions
        avgTimeBetweenImpDays = timeBetweenFandL/impressions/60/60/24/1000
        timeBetweenImpressions.push(avgTimeBetweenImpDays)
    }
    else {
        listValuesOfABreakdown(object, breakdown).forEach(element => {
            avgTimeBetweenImpMS = 0
            avgTimeBetweenImpDays = 0
            impressions = 0
            timeBetweenFandL = 0
            let result = object.filter(e => e[breakdown] == element)
            result.forEach(e => {
                //impressions = impressions + parseInt(e["Impression Count"], 10)
                impressions = impressions + parseInt(e["Touch Count"], 10)
                //timeBetweenFandL = timeBetweenFandL + Date.parse(e["Last Impression Time UTC"]) - Date.parse(e["First Impression Time UTC"])
                timeBetweenFandL = timeBetweenFandL + Date.parse(e["Last Touch Time UTC"]) - Date.parse(e["First Touch Time UTC"])
                
            })
            avgTimeBetweenImpMS = timeBetweenFandL/impressions
            avgTimeBetweenImpDays = timeBetweenFandL/impressions/60/60/24/1000
            timeBetweenImpressions.push(avgTimeBetweenImpDays)
    })
    }
    return timeBetweenImpressions
}

//average time between first impression and conversion
function getTimeFirstImpToConv(object, breakdown){
    let timeFirstImpToConv = []
    let timeBetweenFirstImpAndConv = 0
    let avgTimeBetweenFirstImpAndConvMS = 0
    let avgTimeBetweenFirstImpAndConvDays = 0
    if (breakdown == null){
        object.forEach(e => {
            timeBetweenFirstImpAndConv = timeBetweenFirstImpAndConv + Date.parse(e["Conversion Time UTC"]) - Date.parse(e["First Touch Time UTC"])
        })
        avgTimeBetweenFirstImpAndConvMS = timeBetweenFirstImpAndConv/object.length
        avgTimeBetweenFirstImpAndConvDays = avgTimeBetweenFirstImpAndConvMS/60/60/24/1000
        timeFirstImpToConv.push(avgTimeBetweenFirstImpAndConvDays)
    }
    else {
        listValuesOfABreakdown(object, breakdown).forEach(element => {
            timeBetweenFirstImpAndConv = 0
            avgTimeBetweenFirstImpAndConvMS = 0
            avgTimeBetweenFirstImpAndConvDays = 0
            let result = object.filter(e => e[breakdown] == element)
            result.forEach(e => {
                timeBetweenFirstImpAndConv = timeBetweenFirstImpAndConv + Date.parse(e["Conversion Time UTC"]) - Date.parse(e["First Touch Time UTC"])
            })
            avgTimeBetweenFirstImpAndConvMS = timeBetweenFirstImpAndConv/result.length
            avgTimeBetweenFirstImpAndConvDays = avgTimeBetweenFirstImpAndConvMS/60/60/24/1000
            timeFirstImpToConv.push(avgTimeBetweenFirstImpAndConvDays)
    })
    }
    return timeFirstImpToConv
}

//average time between last impression and conversion
function getTimeLastImpToConv(object, breakdown){
    let timeLastImpToConv = []
    let timeBetweenLastImpAndConv = 0
    let avgTimeBetweenLastImpAndConvMS = 0
    let avgTimeBetweenLastImpAndConvDays = 0
    if (breakdown == null){
        object.forEach(e => {
            //timeBetweenLastImpAndConv = timeBetweenLastImpAndConv + Date.parse(e["Conversion Time UTC"]) - Date.parse(e["Last Impression Time UTC"])
            timeBetweenLastImpAndConv = timeBetweenLastImpAndConv + Date.parse(e["Conversion Time UTC"]) - Date.parse(e["Last Touch Time UTC"])
        })
        avgTimeBetweenLastImpAndConvMS = timeBetweenLastImpAndConv/object.length
        avgTimeBetweenLastImpAndConvDays = avgTimeBetweenLastImpAndConvMS/60/60/24/1000
        timeLastImpToConv.push(avgTimeBetweenLastImpAndConvDays)
    }
    else {
        listValuesOfABreakdown(object, breakdown).forEach(element => {
            timeBetweenLastImpAndConv = 0
            avgTimeBetweenLastImpAndConvMS = 0
            avgTimeBetweenLastImpAndConvDays = 0
            let result = object.filter(e => e[breakdown] == element)
            result.forEach(e => {
                //timeBetweenLastImpAndConv = timeBetweenLastImpAndConv + Date.parse(e["Conversion Time UTC"]) - Date.parse(e["Last Impression Time UTC"])
                timeBetweenLastImpAndConv = timeBetweenLastImpAndConv + Date.parse(e["Conversion Time UTC"]) - Date.parse(e["Last Touch Time UTC"])
            })
            avgTimeBetweenLastImpAndConvMS = timeBetweenLastImpAndConv/object.length
            avgTimeBetweenLastImpAndConvDays = avgTimeBetweenLastImpAndConvMS/60/60/24/1000
            timeLastImpToConv.push(avgTimeBetweenLastImpAndConvDays)
    })
    }
    return timeLastImpToConv
}


// --- Add values to an object ---

function createAnObjectWithStats(object, breakdown){
    let statsObjectArray = []
    listValuesOfABreakdown(object, breakdown).forEach((value,index) => {
        let statsObject = {}
        statsObject[breakdown] = value
        statsObject["Total Impressions"] = getTotalImpressions(object, breakdown)[index]
        statsObject["Total Conversions"] = getTotalConversions(object, breakdown)[index]
        statsObject["Unique Converters"] = getUniqueConverters(object, breakdown)[index]
        statsObject["Days Between Impressions"] = getTimeBetweenImpressions(object, breakdown)[index]
        statsObject["Days From First Impression To Conversion"] = getTimeFirstImpToConv(object, breakdown)[index]
        statsObject["Days From Last Impression To Conversion"] = getTimeLastImpToConv(object, breakdown)[index]
        statsObject["Impressions Per Person"] = statsObject["Total Impressions"]/statsObject["Unique Converters"]
        statsObject["Conversions Per Person"] = statsObject["Total Conversions"]/statsObject["Unique Converters"]
        statsObject["Impressions Per Conversion"] = statsObject["Total Impressions"]/statsObject["Total Conversions"]

        statsObjectArray.push(statsObject)
    })
    return statsObjectArray
}

//Parse out UTMs
function getUTMBreakout(object, parameter){
    object.forEach(e => {
        let referrerURL = e["Conversion Referrer URL"]
        let sourcestart = referrerURL.search(parameter) //"utm_source"
        let substring = ""
        if(sourcestart > 0){
            let trimmedreferrerURL = referrerURL.substr(sourcestart)
            let sourceEnd = trimmedreferrerURL.search("&")
            if(sourceEnd == -1){sourceEnd = trimmedreferrerURL.search(/\?/)}
            if(sourceEnd == -1){sourceEnd = trimmedreferrerURL.length}
            substring = trimmedreferrerURL.substr(0, sourceEnd)
        }
        e[parameter]=substring
    })
}

function findAllUTMTypes(object){
    let UTMTypeArray = []
    object.forEach(e => {
        for(let i=0; i<20; i++){
            let referrerURL = e["Conversion Referrer URL"]
            let utmStart = referrerURL.search("utm")
            referrerURL = referrerURL.substr(utmStart)//start the string at the first UTM
            let utmEnd = referrerURL.search("=")
            let utmString = referrerURL.substr(0,utmEnd)
            let searchIndex = UTMTypeArray.indexOf(utmString)
            if(searchIndex==-1 && utmString !==''){
                UTMTypeArray.push(utmString)
                allHeaders.push(utmString)
            }
            if(utmString ==''){i=20}//look for a max of 20 UTM types
        }
    })
    return UTMTypeArray
}


function addAllUTMsToObject(object){
    return new Promise((resolve, reject) => {
        let UTMTypeArray = findAllUTMTypes(object)
        UTMTypeArray.forEach(e => {
            getUTMBreakout(object, e)
        })
        resolve(object)
    })
}

//Parse out subdirectory

function getSubDirectoryBreakout(object){
    object.forEach(e => {
        let referrerURL = e["Conversion Referrer URL"]
        let firstQuestionMark = referrerURL.search(/\?/)
            if(firstQuestionMark == -1){firstQuestionMark = referrerURL.length}
        let referrerURLTrim1 = referrerURL.substring(8,firstQuestionMark)
        let firstSlash = referrerURLTrim1.search("/")
        let subdomainOne = ""
        let subdomainTwo = ""
        if(firstSlash > 0){
            let referrerURLTrim2 = referrerURL.substring(firstSlash+8+1,firstQuestionMark)
            let secondSlash = referrerURLTrim2.search("/")
            if (secondSlash == -1){
                secondSlash = referrerURL.length
            }
            else{
                let referrerURLTrim3 = referrerURLTrim2.substring(secondSlash+1,firstQuestionMark)
                let thirdSlash = referrerURLTrim3.search("/")
                if (thirdSlash == -1){
                    thirdSlash = referrerURL.length
                }
                subdomainTwo = referrerURLTrim3.substring(0, thirdSlash)
            }
            subdomainOne = referrerURLTrim2.substring(0, secondSlash)
        }
        e['Subdomain One']= subdomainOne
        e['Subdomain Two']= subdomainTwo
        if(subdomainTwo.length > 0)
            {e['Subdomain One + Two'] = subdomainOne+'/'+subdomainTwo}
        else {e['Subdomain One + Two'] = subdomainOne}
    })
}

function addSubdirectoriesToObject(object){
    return new Promise((resolve,reject) =>{
        getSubDirectoryBreakout(object)
        allHeaders.push('Subdomain One')
        allHeaders.push('Subdomain Two')
        allHeaders.push('Subdomain One + Two')
        resolve(object)
    })
}

//Combine clicks+impressions as "touches"

function addTouchCountToObject(object){
    return new Promise((resolve, reject) => {
        object.forEach(e => { 
            e["Touch Count"]= e["Impression Count"] + e["Display Click Count"]
            if(e["Last Display Click Time UTC"] > e["Last Impression Time UTC"]){e["Last Touch Time UTC"] = e["Last Display Click Time UTC"]}
            else {e["Last Touch Time UTC"] = e["Last Impression Time UTC"]}
            // if(e["First Impression Time UTC"] > e["First Display Click Time UTC"]){e["First Touch Time UTC"] = e["First Display Click Time UTC"]}
            // else {e["First Touch Time UTC"] = e["First Impression Time UTC"]}

            if(e["First Display Click Time UTC"] == 0){e["First Touch Time UTC"] = e["First Impression Time UTC"]
                e["troubleshooting"]='e["First Display Click Time UTC"] == 0'
            }
            else if(e["First Impression Time UTC"] == 0){e["First Touch Time UTC"] = e["First Display Click Time UTC"]
            e["troubleshooting"]='e["First Impression Time UTC"] == 0'
            }
            else if(e["First Display Click Time UTC"] < e["First Impression Time UTC"]){e["First Touch Time UTC"] = e["First Display Click Time UTC"]
            e["troubleshooting"]='e["First Display Click Time UTC"] < e["First Impression Time UTC"]'
            }
            else {e["First Touch Time UTC"] = e["First Impression Time UTC"]
            e["troubleshooting"]='e["First Touch Time UTC"] = e["First Impression Time UTC'
            }
        })
        resolve(object)
    })
}

//------Visuals ----//

//destroy all charts
function destroyAllCharts(){
    Object.keys(myCharts).forEach(function(key) {
        myCharts[key].destroy()
    });
}
//create a chart
function generateChart(dataForChart, breakdown, canvasID, excludeblankXValues, yValue1, yValue2, yValue3, yValue4, yValue5, yValue6){
    let xValues = []
    let yValuesOne = []
    let yValuesTwo = []
    let yValuesThree = []
    let yValuesFour = []
    let yValuesFive = []
    let yValuesSix = []
    for(let i=0; i<dataForChart.length; i++){
        if (excludeblankXValues == "excludeblankXValues"){
            if (dataForChart[i][breakdown].length > 0){
                xValues.push(dataForChart[i][breakdown])
                yValuesOne.push(dataForChart[i][yValue1])
                if(dataForChart[i][yValue2] !== undefined){yValuesTwo.push(dataForChart[i][yValue2])}
                if(dataForChart[i][yValue3] !== undefined){yValuesThree.push(dataForChart[i][yValue3])}
                if(dataForChart[i][yValue2] !== undefined){yValuesFour.push(dataForChart[i][yValue4])}
                if(dataForChart[i][yValue3] !== undefined){yValuesFive.push(dataForChart[i][yValue5])}
                if(dataForChart[i][yValue3] !== undefined){yValuesSix.push(dataForChart[i][yValue6])}
            }
        }
        else{
            xValues.push(dataForChart[i][breakdown])
            yValuesOne.push(dataForChart[i][yValue1])
            if(dataForChart[i][yValue2] !== undefined){yValuesTwo.push(dataForChart[i][yValue2])}
            if(dataForChart[i][yValue3] !== undefined){yValuesThree.push(dataForChart[i][yValue3])}
            if(dataForChart[i][yValue2] !== undefined){yValuesFour.push(dataForChart[i][yValue4])}
            if(dataForChart[i][yValue3] !== undefined){yValuesFive.push(dataForChart[i][yValue5])}
            if(dataForChart[i][yValue3] !== undefined){yValuesSix.push(dataForChart[i][yValue6])}
        }
    }
    let options = {
        scales: {
            xAxis: {
                grid: {color: 'white'},
                // ticks: {
                //     callback: function(label, index, labels) {
                //         label = this.getLabelForValue(label)
                //         if (/\s/.test(label)) {return label.split(" ");}
                //         else if (/_/.test(label)) {return label.split("_");}
                //         else{return label;}              
                //     }
                // }
            },
            y: {
                type: 'linear',
                position: 'left',
                grid: {color: 'white', drawOnChartArea: false}
              }, 
            y1: {
                type: 'linear',
                position: 'right',
                grid: {color: 'white', drawOnChartArea: false}
            }
        }
    }

    if(typeof myCharts[canvasID] === 'undefined') {}
    else if(myCharts[canvasID]!== null){myCharts[canvasID].destroy()}

    if(yValuesTwo.length>0){
        myCharts[canvasID] = new Chart(canvasID, {
        type: "bar",
        data: {
            labels: xValues,
            datasets: 
                [{label: yValue1, yAxisID: 'y', backgroundColor: ['rgba(238, 196, 187, .2)'], borderColor: ['rgba(238, 196, 187)'],
                    borderWidth: 1, data: yValuesOne},
                {label: yValue2, yAxisID: 'y', backgroundColor: ['rgba(216,61,81, .2)'], borderColor: ['rgba(216,61,81)'], 
                    borderWidth: 1, data: yValuesTwo},
                {label: yValue3, yAxisID: 'y', backgroundColor: ['rgba(213,51,0,.2)'], borderColor: ['rgba(213,51,0)'], 
                    borderWidth: 1, data: yValuesThree},
                {label: yValue4, yAxisID: 'y1', backgroundColor: ['rgba(223,118,40,.2)'], borderColor: ['rgba(223,118,40)'], 
                    borderWidth: 1, data: yValuesFour},
                {label: yValue5, yAxisID: 'y1', backgroundColor: ['rgba(228,168,7,.2)'], borderColor: ['rgba(228,168,7)'], 
                    borderWidth: 1, data: yValuesFive},
                {label: yValue6, yAxisID: 'y1', backgroundColor: ['rgba(237,197,90,.2)'], borderColor: ['rgba(237,197,90)'], 
                    borderWidth: 1, data: yValuesSix},
            ],
            },
        options:  {
            responsive: true,
            interaction: {
              mode: 'index',
              intersect: false,
            },
            stacked: false,
            plugins: {
            //   title: {
            //     display: true,
            //     text: 'Chart.js Line Chart - Multi Axis'
            //   }
            }
        }});
    }


//My Color Pallette
//#EEC4BB Baby Pink - rgba(238,196,187)
//#D83D51 Darker Pink - rgba(216,61,81)
//#D53300 Dark Orange/Red - rgba(213,51,0)
//#DF7628 Orange - rgba(223,118,40)
//#E4A807 Golden Rod - rgb(228,168,7)
//#EDC55A Light Yellow - rgba(237,197,90)
//#8CEB99 Light Green - rgba(140,235,153)
//#629E48 Medium Green - rgba(98,158,72)
//#30482E Dark Green - rgba(48,72,46)


    else if(yValuesTwo.length==0){
        myCharts[canvasID] = new Chart(canvasID, {
            type: "bar",
            data: {
                labels: xValues,
                datasets: 
                [{label: yValue1, yAxisID: 'y', backgroundColor: ['rgba(228,168,7, 0.2)'], borderColor: ['rgba(228,168,7)'],
                borderWidth: 1, data: yValuesOne},]
            },
            options: options
            });
    }

    // else{
    //     myCharts[canvasID] = new Chart(canvasID, {
    //         type: "bar",
    //         data: {
    //             labels: xValues,
    //             datasets: 
    //             [{label: yValue1, backgroundColor: ['rgba(255, 99, 132, 0.2)'], borderColor: ['rgba(255, 99, 132)'],
    //             borderWidth: 1, data: yValuesOne}]
    //         },
    //         options: options
    //         });
    // }
}


function generateAllCharts(object){

    
    //conversions by utm source
    let dataForChart = {}

    let UTMTypeArray = findAllUTMTypes(object)
    UTMTypeArray.forEach(e => {
        dataForChart = createAnObjectWithStats(object, e)

        let UTMChartWrapper = document.getElementById("utm-charts-wrapper")
        let newCanvas = document.createElement("canvas")
        let newCanvasID = e+"chartID"
        newCanvas.setAttribute("id",newCanvasID)
        newCanvas.setAttribute("class","chart utm conversions")
        newCanvas.setAttribute("style","width:100%;max-width:30vw;max-height:30vw")
        UTMChartWrapper.appendChild(newCanvas)
        myCharts[newCanvasID] = null
        //if(myCharts[newCanvasID]!== null){myCharts[newCanvasID].destroy()}
        generateChart(dataForChart, e, newCanvasID, "excludeblankXValues", "Total Conversions")
    })
    

    //campaign stats
    dataForChart = createAnObjectWithStats(object, "Last Impression Campaign Name")
    generateChart(dataForChart, "Last Impression Campaign Name",  "campaign", "INcludeblankXValues", "Total Conversions", "Unique Converters","Impressions Per Person", "Days From First Impression To Conversion", "Days From Last Impression To Conversion", "Days Between Impressions","Conversions Per Person", "Impressions Per Conversion")



    //device Type stats
    dataForChart = createAnObjectWithStats(object, "Last Impression Device Type")
    generateChart(dataForChart, "Last Impression Device Type",  "deviceType", "INcludeblankXValues", "Total Conversions", "Unique Converters","Impressions Per Person", "Days From First Impression To Conversion", "Days From Last Impression To Conversion", "Days Between Impressions","Conversions Per Person", "Impressions Per Conversion")

}

//create a table

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    }
  }

  function generateTableContent(table, data) {
    let tbody = table.createTBody();
    for (let element of data) {
      let row = tbody.insertRow();
      for (key in element) {
        let cell = row.insertCell();
        let formattedNumber = element[key].toLocaleString(
            undefined, 
            { maximumFractionDigits: 2 }
          )
        //let text = document.createTextNode(element[key]);
        let text = document.createTextNode(formattedNumber);
        cell.appendChild(text);
      }
    }
  }
  
function generateFullTable(object, breakdown){
    let dataForTable = createAnObjectWithStats(object, breakdown)
    let table = document.querySelector("table");
    table.innerHTML = ""
    table = document.querySelector("table")
    let data = Object.keys(dataForTable[0]);
    generateTableHead(table, data);
    generateTableContent(table, dataForTable);
}


// Create breakdown & filter options


function clearExistingItems(options, id, listItemClassName){
        let existingItems = document.getElementsByClassName(listItemClassName)
        if (existingItems.length == null) {}
        else {
            for (let i = existingItems.length-1; i > -1; i--) {
                document.getElementById(id).removeChild(existingItems[i])
            }
        }
}

function addNewItems([options, id, listItemClassName]){
        if (options == null || id == null || listItemClassName == null){}
        else{
            options.forEach( e => {
                let a = document.createElement('a'); // generate node
                a.setAttribute('href', '#');         // set attribute
                a.setAttribute('class', listItemClassName)
                a.textContent = e;               // assign some text
                document.getElementById(id).appendChild(a)
            })
        }
}

function addItemsToList(options, id, listItemClassName){
    clearExistingItems(options, id, listItemClassName)
    addNewItems([options, id, listItemClassName])
}

function addBreakdownsToList(){
    addItemsToList(allHeaders,"breakdownDropdown","breakdown-list-item")
    addItemsToList(allHeaders,"filterBreakdownDropdown", "filter-breakdown-list-item")
}

function respondToBreakDownSelection(){
    let breakdownButtons = document.getElementsByClassName('breakdown-list-item')
    for (let i = 0; i < breakdownButtons.length; i++) {
    breakdownButtons[i].addEventListener("click",function(){
        document.getElementById("myBreakdownInput").value = breakdownButtons[i].textContent
        document.getElementById("breakdownDropdown").classList.toggle("show");
        breakdown = breakdownButtons[i].textContent
    })
    }
}

function respondToFilterBreakDownSelection(object){
    let breakdownButtons = document.getElementsByClassName('filter-breakdown-list-item')
    for (let i = 0; i < breakdownButtons.length; i++) {
    breakdownButtons[i].addEventListener("click",function(){
        //document.getElementById("filter-label").innerHTML = breakdownButtons[i].textContent
        document.getElementById("myFilterBreakdownInput").value = breakdownButtons[i].textContent
        // document.getElementById('filter-by-text').innerHTML = breakdownButtons[i].textContent
        document.getElementById("filterBreakdownDropdown").classList.toggle("show");
        filteredBreakdown = breakdownButtons[i].textContent
        let filterableOptions = getUniqueValuesForFilter(object, filteredBreakdown)
        filterValueArray = [] //reset the filters
        document.getElementById("myFilterablesInput").value = "Search..."
        addItemsToList(filterableOptions, "filterablesDropdown", "filterables-list-item")
        respondToFilterSelection()
        document.getElementById('filterables-container').classList.remove('hide')
        document.getElementById('filterables-container').classList.add('show')
    })
    }
}

function getUniqueValuesForFilter(object, filterBreakdown){
    let filterableOptions = listValuesOfABreakdown(object, filterBreakdown)
    return filterableOptions
}

function respondToFilterSelection(){
    let breakdownButtons = document.getElementsByClassName('filterables-list-item')
    for (let i = 0; i < breakdownButtons.length; i++) {
    breakdownButtons[i].addEventListener("click",function(){
        document.getElementById("myFilterablesInput").value = breakdownButtons[i].textContent
        document.getElementById("filterablesDropdown").classList.add("show");
        breakdownButtons[i].classList.toggle('selected')
        filterValueArray = []
        let selectedItemsInFilter = document.getElementsByClassName('selected')
        if (selectedItemsInFilter.length > 0){
            for (let i = 0; i < selectedItemsInFilter.length; i++) {
                //add items to filter filterValueArray
                filterValueArray.push(selectedItemsInFilter[i].textContent)
            }
        }
        additionalRuns()
    })
    }
}

function clearFilters(){
    let breakdownButtons = document.getElementsByClassName('filterables-list-item')
    filterValueArray = [] //reset the filters
    document.getElementById("myFilterablesInput").value = "Search..."
    additionalRuns()
    for (let i = 0; i < breakdownButtons.length; i++) {
        breakdownButtons[i].classList.remove('selected')
        console.log("breakdownButtons[i] -- i = "+i)
        console.log(breakdownButtons[i])
    }
    console.log("clearFilters")
}

function rerunOnBreakDownChange(){
    let breakdownButtons = document.getElementsByClassName('breakdown-list-item')
    for (let i = 0; i < breakdownButtons.length; i++) {
    breakdownButtons[i].addEventListener("click", function(){
        document.getElementById("myBreakdownInput").value = breakdownButtons[i].textContent
        document.getElementById("breakdownDropdown").classList.toggle("show");

            breakdown = breakdownButtons[i].textContent
            console.log("starting Additinal Runs")
            additionalRuns()
        })
    }
}


/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function toggleClassListFunction(id) {
    document.getElementById(id).classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it

window.onclick =  function(event) {
    closeDropDownsOnClickOut(event, '#myBreakdownInput', "#myBreakdownInput", "breakdownDropdown")
    closeDropDownsOnClickOut(event, '#myFilterBreakdownInput',"#myFilterBreakdownInput", "filterBreakdownDropdown")
    closeDropDownsOnClickOut(event, '#myFilterablesInput', "#myFilterablesInput", "filterablesDropdown", ".filterables-list-item")
}



function closeDropDownsOnClickOut(event, buttonLableId, inputId, breakdownDivIdName, listItemsClassName) {
    let breakdownDivId = "#"+"breakdownDivIdName"
    if (!event.target.matches(buttonLableId) && !event.target.matches(inputId) && !event.target.matches(breakdownDivId) && !event.target.matches(listItemsClassName)) {
        let dropdown = document.getElementById(breakdownDivIdName);
        if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        }
    }
}

//filter searches in dropdown

function filterFunction(input,dropdown) {
    var input, filter, ul, li, a, i;
    input = document.getElementById(input);
    filter = input.value.toUpperCase();
    div = document.getElementById(dropdown);
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
}

// Order of operations


async function initialRun(){
        //addBreakdownsToList()
        respondToBreakDownSelection()
        let originalObject = await csvtoObjectPromise()
        originalObject = await addTouchCountToObject(originalObject)
        originalObject = await addAllUTMsToObject(originalObject)
        originalObject = await addSubdirectoriesToObject(originalObject)
        addBreakdownsToList(originalObject)
        respondToFilterBreakDownSelection(originalObject)
        filteredBreakdown = "First Impression Campaign Name"
        filterValueArray = listValuesOfABreakdown(originalObject, filteredBreakdown) //placeholder (doesn't filter)
        let result1 =  getFilteredObject(originalObject, filteredBreakdown, filterValueArray)
        generateFullTable(result1, breakdown)
        generateAllCharts(result1)
        addAllUTMsToObject(result1) //do I need this?
        addSubdirectoriesToObject(result1) //need this?
        console.log("initial run done")
}

function additionalRuns(){
    originalObject = object
    let result1 =  getFilteredObject(originalObject, filteredBreakdown, filterValueArray)
    generateFullTable(result1, breakdown)
    destroyAllCharts()
    generateAllCharts(result1)
    console.log("finished Additinal Runs")
}

async function multiStepOrderOfOps(){
    let stepOne = await initialRun()
    rerunOnBreakDownChange(stepOne)
}

multiStepOrderOfOps()