const access_restrictions = document.getElementById("access_restrictions");

let token = document.getElementById('token')
token.addEventListener('load', getData())
country_list();

function getData() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("client_id", "VNpZ5dQcxmAGLeHVu6kGmlG829LU8Bj2");
    urlencoded.append("client_secret", "0fvTTv2cFsPbO5Sj");
    urlencoded.append("grant_type", "client_credentials");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("https://test.api.amadeus.com/v1/security/oauth2/token", requestOptions)
        .then(response => response.text())
        .then(result => {
            document.getElementById('token').innerHTML = JSON.parse(result)['access_token']
        })
        .catch(error => console.log('error', error));
}

function getInfo() {
    let token = document.getElementById('token').innerHTML
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    let country = document.getElementById('target').value;
    console.log(country)
    //code = country.replace('(', '');
    //code = code.replace(')', '');
    //code = code.substr(-2)


    //fetch(`https://test.api.amadeus.com/v1/duty-of-care/diseases/covid19-area-report?countryCode=${code}`

    // fetch("https://test.api.amadeus.com/v2/duty-of-care/diseases/covid19-area-report?countryCode=TW", requestOptions)
    fetch(`https://test.api.amadeus.com/v2/duty-of-care/diseases/covid19-area-report?countryCode=${country}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            //console.log(result);

            //JSON.parse(result)
            // console.log(JSON.parse(result))

            const obj = JSON.parse(result);
            console.log(obj.data.areaAccessRestriction.declarationDocuments);

            // const object = obj.data.areaAccessRestriction;
            // for (const [key, value] of Object.entries(object)) {
            //   // console.log(key, value);
            //   if(value.text){
            //     access_restrictions.innerHTML+=value.text;
            //   }
            //}

            //AREA ACCESS RESTRICTION
            const object = obj.data.areaAccessRestriction;

            //DECLARATION DOCUMENTS
            if (object.declarationDocuments.text === undefined) {
                declaration_documents.innerHTMLL = `<p>NIL</p>`
            } else {
                declaration_documents.innerHTML = object.declarationDocuments.text
            }
            // declaration_documents.innerHTML = object.declarationDocuments.text

            //ENTRY
            entry_text.innerHTML = object.entry.text
            if (object.entry.ban == 'Yes') {
                entry_ban.innerHTML = `<span class="badge text-bg-success">${object.entry.ban}</span>`
            } else if (object.entry.ban == 'Partial') {
                entry_ban.innerHTML = `<span class="badge text-bg-warning">${object.entry.ban}</span>`
            } else {
                entry_ban.innerHTML = `<span class="badge text-bg-danger">${object.entry.ban}</span>`
            }
            // entry_ban.innerHTML = object.entry.ban
            entry_referencelink.innerHTML = `<a href='${object.entry.referenceLink}'>${object.entry.referenceLink}</a><br>`

            //TRAVEL TEST
            //traveltest_requirement.innerHTML = object.travelTest.isRequired
            if (object.travelTest.isRequired == 'Yes') {
                traveltest_requirement.innerHTML = `<span class="badge text-bg-success test-style">${object.travelTest.isRequired}</span>
                                          <br><br>
                                          <b>Find out more: </b> <a href='${object.travelTest.referenceLink}'>${object.travelTest.referenceLink}</a>`
            } else if (object.travelTest.isRequired == 'Yes, conditional') {
                traveltest_requirement.innerHTML = `<span class="badge text-bg-warning test-style">${object.travelTest.isRequired}</span>
                                          <br><br>
                                          <b>Find out more: </b> <a href='${object.travelTest.referenceLink}'>${object.travelTest.referenceLink}</a>`
            }
            else {
                traveltest_requirement.innerHTML = `<span class="badge text-bg-danger test-style">${object.travelTest.isRequired}</span>`
            }


            // if (!object.travelTest.includes('referenceLink')) {
            //   travelTest.referenceLink.innerHTML = `<p>NIL</p>`
            // } else {
            //   travelTest.referenceLink.innerHTML = `<a href='${object.travelTest.referenceLink}'>${object.travelTest.referenceLink}</a>`
            // }
            //traveltest_link.innerHTML = `<a href='${object.travelTest.referenceLink}'>${object.travelTest.referenceLink}</a>`

            //TRAVEL VACCINATION
            //travelvacc_requirement.innerHTML = object.travelVaccination.isRequired
            if (object.travelVaccination.isRequired == 'Yes') {
                travelvacc_requirement.innerHTML = `<span class="badge text-bg-success">${object.travelVaccination.isRequired}</span><br><br>
                                          <b>Vaccination certificate accepted: </b>
                                          <ul>
                                              <li>${object.travelVaccination.acceptedCertificates}</div></li>
                                          </ul><br>
                                          <b>Vaccination details: </b>${object.travelVaccination.details}</div><br>
                                          <b>Vaccination age requirement: </b>${object.travelVaccination.minimumAge} <div style="display:inline-block;">years old
                                          `
            } else {
                travelvacc_requirement.innerHTML = `<span class="badge text-bg-danger">${object.travelVaccination.isRequired}</span>`
            }
            //travelvacc_cert.innerHTML = object.travelVaccination.acceptedCertificates
            //travelvacc_details.innerHTML = object.travelVaccination.details
            //travelvacc_age.innerHTML = object.travelVaccination.minimumAge

            //QUARANTINE MODALITY
            travelqt_text.innerHTML = object.travelQuarantineModality.text
            //travelqt_eligible.innerHTML = object.travelQuarantineModality.eligiblePerson
            if (object.travelQuarantineModality.eligiblePerson != 'None') {
                travelqt_eligible.innerHTML = `${object.travelQuarantineModality.eligiblePerson}
                                    <br><br>
                                    <b>Quarantine Type: </b>${object.travelQuarantineModality.quarantineType}
                                    <br><br>
                                    <b>Quarantine duration: </b>${object.travelQuarantineModality.duration} days
                                    <br><br>
                                    <b>Find out more: </b> <a href='${object.travelQuarantineModality.referenceLink}'>${object.travelQuarantineModality.referenceLink}</a><br>`
            } else {
                travelqt_eligible.innerHTML = object.travelQuarantineModality.eligiblePerson
            }
            // travelqt_quarantine.innerHTML = object.travelQuarantineModality.quarantineType
            // travelqt_duration.innerHTML = object.travelQuarantineModality.duration
            // travelqt_link.innerHTML = `<a href='${object.travelQuarantineModality.referenceLink}'>${object.travelQuarantineModality.referenceLink}</a>`

            //TRACING APPLICATION
            //traceapp.innerHTML = object.tracingApplication.isRequired
            if (object.tracingApplication.isRequired == 'Yes') {
                traceapp.innerHTML = `<span class="badge text-bg-success">${object.tracingApplication.isRequired}</span>
                            <br><br>
                            <b>IOS Url: </b><a href='${object.tracingApplication.iosUrl}'>${object.tracingApplication.iosUrl}</a>
                            <br><br>
                            <b>Android Url: </b><a href='${object.tracingApplication.androidUrl}'>${object.tracingApplication.androidUrl}</a>
                            `
            } else if (object.tracingApplication.isRequired == 'Recommended') {
                traceapp.innerHTML = `<span class="badge text-bg-warning">${object.tracingApplication.isRequired}</span>
                            <br><br>
                            <b>IOS Url: </b><a href='${object.tracingApplication.iosUrl}'>${object.tracingApplication.iosUrl}</a>
                            <br><br>
                            <b>Android Url: </b><a href='${object.tracingApplication.androidUrl}'>${object.tracingApplication.androidUrl}</a>
                            `
            }
            else {
                traceapp.innerHTML = `<span class="badge text-bg-danger">${object.tracingApplication.isRequired}</span>`
            }

            //MASK REGULATION
            mask_text.innerHTML = object.masks.text
            mask_requirement.innerHTML = object.masks.isRequired

            //EXIT
            //(!("key" in obj)); // true if "key" doesn't exist in object
            // if (!("object.exit.text" in object.exit)) {
            if (object.exit.text === undefined) {
                exit_text.innerHTML = `<p>NIL</p>`
            } else {
                exit_text.innerHTML = object.exit.text
            }
            //exit_text.innerHTML = object.exit.text

            //exit_text.innerHTML = object.exit.text
            //exit_requirement.innerHTML = object.exit.specialRequirements
            if (object.exit.specialRequirements == 'Yes') {
                exit_requirement.innerHTML = `<span class="badge text-bg-success">${object.exit.specialRequirements}</span><br>`
            } else if (object.exit.specialRequirements == 'Yes, conditional') {
                exit_requirement.innerHTML = `<span class="badge text-bg-warning">${object.exit.specialRequirements}</span><br>`
            } else {
                exit_requirement.innerHTML = `<span class="badge text-bg-danger">${object.exit.specialRequirements}</span><br>`
            }

            // if (!("object.exit.referenceLink" in object.exit)) {
            //   exit_link.innerHTML = `<p>NIL</p>`
            // } else {
            //   exit_link.innerHTML = object.exit.referenceLink
            // }

            if (object.exit.referenceLink === undefined) {
                exit_link.innerHTML = `<p>NIL</p>`
            } else {
                exit_link.innerHTML = object.exit.referenceLink
            }
        })


        .catch(error => console.log('error', error));
}

function country_list() {
    console.log("**** [START] country_list_api() *****")
    //let arr = [];
    let string = "";

    const options = {
        method: 'GET',
        url: 'https://city-list.p.rapidapi.com/api/getCountryList',
        headers: {
            'X-RapidAPI-Key': '4f7618f0c7msh976688b82e5bb70p1973d0jsn25598be7fb57',
            'X-RapidAPI-Host': 'city-list.p.rapidapi.com'
        }
    };

    axios.request(options)
        .then(function (response) {

            // Inspect the response.data
            // Got some response back

            let records = response.data
            //console.log(records);
            //console.log(records[0][0].iso);
            //console.log(records[0][0].cname);
            for (i = 0; i < records[0].length; i++) {
                //let result = records[0][i].cname + "(" + records[0][i].iso + ")";
                string += `<option value="${records[0][i].iso}">${records[0][i].cname}</option>`;
                //arr.push(result);
            }
            //console.log(arr);
            document.getElementById("target").innerHTML = string;
            //sessionStorage.setItem("country","China(CN)");
            if (sessionStorage.getItem("country")) {
                code = sessionStorage.getItem("country").replace('(', '');
                code = code.replace(')', '');
                code = code.substr(-2)
                document.getElementById("target").value = code;
            }
            getInfo();
        })
        .catch(function (error) {
            // In case of any error, see what it's about
            console.log(error)
        })

    console.log("**** [END] country_list_api() *****")
    //return arr;
}
